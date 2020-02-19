import { BehaviorSubject, combineLatest, of, zip, Observable, merge } from 'rxjs';
import { map, switchMap, filter, tap, mergeMap, take } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../store';

import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../feeds.service';
import { GroupType } from '../../feeds.utils.service';
import { FeedsUtilsService } from '../../feeds.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { FeedsAmplitudeService } from './../../feeds.amplitude.service';
import { CPTrackingService, UserService } from '@campus-cloud/shared/services';
import { SocialWallContentObjectType, SocialWallContent } from './../../model';

interface ICurrentView {
  label: string;
  action: number;
  group_id: number;
  commentingMemberType: number;
  postingMemberType: number;
}

interface IState {
  query: string;
  group_id: number;
  wall_type: number;
  feeds: Array<any>;
  post_types: number;
  is_integrated: boolean;
  isCampusThread: boolean;
  currentView?: ICurrentView;
  flagged_by_users_only: number;
  removed_by_moderators_only: number;
}

const state: IState = {
  feeds: [],
  query: '',
  post_types: 1,
  group_id: null,
  wall_type: null,
  currentView: null,
  is_integrated: false,
  isCampusThread: true,
  flagged_by_users_only: null,
  removed_by_moderators_only: null
};

@Component({
  selector: 'cp-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() groupId: number;
  @Input() selectedItem: any;
  @Input() groupType: GroupType;
  @Input() hideIntegrations = false;

  channels;
  loading = true;
  disablePost = 100;
  state: IState = state;
  isFilteredByRemovedPosts$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isFilteredByFlaggedPosts$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  results$: Observable<Array<{ id: number; type: string; children?: number[] }> | any[]>;
  isCampusWallView$: BehaviorSubject<any> = new BehaviorSubject({
    type: 1,
    group_id: null
  });

  constructor(
    public session: CPSession,
    public service: FeedsService,
    public cpTracking: CPTrackingService,
    public store: Store<fromStore.IWallsState>,
    public userService: UserService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  searchHandler(query: string) {
    query = query.trim();
    // if query is empty do regular search
    if (!query) {
      this.state = {
        ...this.state,
        query: ''
      };
      this.store.dispatch(fromStore.setResults({ results: [] }));
      this.resetPagination();
      this.fetch();
      return;
    }

    if (this.pageNumber > 1 && !this.state.query) {
      this.resetPagination();
    }

    this.state = {
      ...this.state,
      query
    };

    let amplitude = {};

    amplitude = {
      post_type: FeedsAmplitudeService.getPostType(this.state),
      wall_source: FeedsAmplitudeService.getWallSource(this.state)
    };

    const validObjectTypes = [
      SocialWallContentObjectType.campusThread,
      SocialWallContentObjectType.campusComment
    ];

    if (!this.state.isCampusThread) {
      validObjectTypes.push(
        SocialWallContentObjectType.groupComment,
        SocialWallContentObjectType.groupThread
      );
    }

    const schoolParam = new HttpParams().set('school_id', this.session.school.id.toString());

    let searchCampusParam: HttpParams = !this.state.isCampusThread
      ? schoolParam.set('group_id', this.state.wall_type.toString())
      : schoolParam;

    searchCampusParam = searchCampusParam
      .set('obj_types', validObjectTypes.join(','))
      .set('search_str', query);

    /**
     * do ranged search on all valid object types
     */
    const matchingResources$ = this.service.searchCampusWall(
      this.startRange,
      this.endRange,
      searchCampusParam
    );

    const stream$ = matchingResources$.pipe(
      switchMap((results: SocialWallContent[]) => {
        /**
         * get all ids to be used to call each endpoint separately
         */
        const campusThreadIds = results
          .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.campusThread)
          .map((r: SocialWallContent) => r.id);

        const campusThreadCommentIds = results
          .filter(
            (r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.campusComment
          )
          .map((r: SocialWallContent) => r.id);

        const groupThreadIds = results
          .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.groupThread)
          .map((r: SocialWallContent) => r.id);

        const groupThreadCommentIds = results
          .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.groupComment)
          .map((r: SocialWallContent) => r.id);

        /**
         * dont call the api unless we have matching results
         */
        if (
          this.state.isCampusThread &&
          !campusThreadIds.length &&
          !campusThreadCommentIds.length
        ) {
          return of([]);
        } else if (
          !this.state.isCampusThread &&
          !groupThreadIds.length &&
          !groupThreadCommentIds.length
        ) {
          return of([]);
        }
        let threadSearch = this.getFilterParams();

        threadSearch = this.state.isCampusThread
          ? threadSearch
              .set('school_id', this.session.g.get('school').id.toString())
              .set('thread_ids', campusThreadIds.length ? campusThreadIds.join(',') : null)
              .set(
                'comment_ids',
                campusThreadCommentIds.length ? campusThreadCommentIds.join(',') : null
              )
          : threadSearch
              .set('group_id', this.state.wall_type.toString())
              .set('group_thread_ids', groupThreadIds.length ? groupThreadIds.join(',') : null)
              .set(
                'comment_ids',
                groupThreadCommentIds.length ? groupThreadCommentIds.join(',') : null
              );

        /**
         * Convert the array of SocialWallContent into an object
         * whose keys are the resources IDs and the value is the highlighted content
         */
        const replaceMatchedContent = (threads, messageKey = 'message') => {
          const resultsAsObject = results.reduce((result, current: SocialWallContent) => {
            result[current.id] = current.highlight;
            return result;
          }, {});

          return threads.map((thread) => {
            if (thread.id in resultsAsObject) {
              const { name, description } = resultsAsObject[thread.id];
              return {
                ...thread,
                display_name: name ? name[0] : thread.display_name,
                [messageKey]: description ? description[0] : thread.description
              };
            }
            return thread;
          });
        };

        /**
         * in order to preserve ES's ordering, we need to sort
         * the results from GET by thread_ids request in the
         * same order as we received them when doing the search
         */
        const orderBasedOnElasticSearchScore = (formattedResults) => {
          const orderedSearchIds = results.map((r: SocialWallContent) => r.id);
          const formattedResultsAsObject = formattedResults.reduce(
            (result, current: SocialWallContent) => {
              result[current.id] = current;
              return result;
            },
            {}
          );

          return orderedSearchIds
            .filter((resourceId: number) => resourceId in formattedResultsAsObject)
            .map((resourceId: number) => formattedResultsAsObject[resourceId]);
        };

        const groupThreads$ = this.service
          .getGroupThreadsByIds(threadSearch)
          .pipe(
            filter((threads: any) => threads.filter((t) => t.group_id === this.state.group_id))
          );

        const groupComments$ = this.service
          .getGroupCommentsByIds(threadSearch)
          .pipe(
            filter((threads: any) => threads.filter((t) => t.group_id === this.state.group_id))
          );

        const socialGroupResults$ = zip(groupThreads$, groupComments$).pipe(
          map(([threads, comments]) => {
            const result = [
              ...replaceMatchedContent(threads),
              ...replaceMatchedContent(comments, 'comment')
            ];
            return orderBasedOnElasticSearchScore(result);
          })
        );

        const campusThreads$ = combineLatest([
          this.service.getCampusThreadByIds(threadSearch),
          this.store.pipe(select(fromStore.getSocialPostCategories))
        ]).pipe(
          map(([threads, channels]: any) => {
            const name = !this.state.post_types
              ? amplitudeEvents.All_CATEGORIES
              : channels.find((c) => c.id === this.state.post_types).name;

            const categoryName = !this.state.is_integrated ? name : amplitudeEvents.INTEGRATED_FEED;

            amplitude = {
              ...amplitude,
              campus_wall_category: categoryName
            };
            return threads;
          })
        );

        const campusComments$ = this.service.getCampusCommentsByIds(threadSearch);
        const campusWallResults$ = zip(campusThreads$, campusComments$).pipe(
          map(([threads, comments]) => {
            const result = [
              ...replaceMatchedContent(threads),
              ...replaceMatchedContent(comments, 'comment')
            ];
            return orderBasedOnElasticSearchScore(result);
          })
        );

        const threads$ = this.state.isCampusThread ? campusWallResults$ : socialGroupResults$;

        return threads$;
      })
    );

    super
      .fetchData(stream$)
      .then((res) => {
        this.store.dispatch(fromStore.setResults({ results: res.data }));
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_SEARCHED_INFORMATION, amplitude);
        this.state = Object.assign({}, this.state, {
          feeds: FeedsUtilsService.groupThreads(res.data)
        });
      })
      .catch(() => {
        this.loading = false;
        this.state = Object.assign({}, this.state, { feeds: [] });
      });
  }

  onFilterByCategory(category) {
    this.onDoFilter(category);
    this.setItemInCategory(category);
  }

  onDoFilter(data) {
    const { wall_type, post_types, flagged_by_users_only, removed_by_moderators_only } = data;
    this.store.dispatch(fromStore.setGroupId({ groupId: wall_type === 1 ? null : wall_type }));
    this.store.dispatch(fromStore.setPostType({ postType: post_types }));
    this.store.dispatch(
      fromStore.setFlaggedByModerator({ flagged: Boolean(removed_by_moderators_only) })
    );
    this.store.dispatch(fromStore.setFlaggedByUser({ flagged: Boolean(flagged_by_users_only) }));

    this.isCampusWallView$.next({
      type: wall_type,
      group_id: data.group_id
    });

    // filter by removed posts
    if (removed_by_moderators_only) {
      this.isFilteredByRemovedPosts$.next(true);
    } else {
      this.isFilteredByRemovedPosts$.next(false);
    }

    // filter by flagged posts
    if (flagged_by_users_only) {
      this.isFilteredByFlaggedPosts$.next(true);
    } else {
      this.isFilteredByFlaggedPosts$.next(false);
    }

    this.state = Object.assign({}, this.state, {
      group_id: data.group_id,
      wall_type: wall_type,
      post_types: post_types,
      currentView: data.currentView,
      is_integrated: data.is_integrated,
      isCampusThread: wall_type === 1,
      flagged_by_users_only: flagged_by_users_only,
      removed_by_moderators_only: removed_by_moderators_only
    });

    if (this.state.query) {
      this.searchHandler(this.state.query);
      return;
    }

    this.fetch();
  }

  setItemInCategory(category) {
    this.selectedItem = category;
  }

  onPaginationNext() {
    super.goToNext();

    if (this.state.query) {
      this.searchHandler(this.state.query);
    } else {
      this.fetch();
    }
  }

  onPaginationPrevious() {
    super.goToPrevious();
    if (this.state.query) {
      this.searchHandler(this.state.query);
    } else {
      this.fetch();
    }
  }

  private getFilterParams(): HttpParams {
    const flagged = this.state.flagged_by_users_only
      ? this.state.flagged_by_users_only.toString()
      : null;

    const removed = this.state.removed_by_moderators_only
      ? this.state.removed_by_moderators_only.toString()
      : null;

    const type = this.state.post_types ? this.state.post_types.toString() : null;

    return new HttpParams()
      .set('post_types', type)
      .set('flagged_by_users_only', flagged)
      .set('removed_by_moderators_only', removed);
  }

  private fetch() {
    let search = this.getFilterParams();

    search = this.state.isCampusThread
      ? search.append('school_id', this.session.g.get('school').id.toString())
      : search.append('group_id', this.state.wall_type.toString());

    const stream$ = this.doAdvancedSearch(search);

    super
      .fetchData(stream$)
      .then((res) => {
        this.store.dispatch(fromStore.addThreads({ threads: res.data }));
        this.state = Object.assign({}, this.state, { feeds: res.data });
      })
      .catch((_) => null);
  }

  doAdvancedSearch(search) {
    const groupThread$ = this.service.getGroupWallFeeds(this.startRange, this.endRange, search);
    const campusThread$ = this.service.getCampusWallFeeds(this.startRange, this.endRange, search);

    if (!this.state.isCampusThread) {
      return groupThread$;
    }
    // do not call the API if we have categories
    const channels$ = this.store.select(fromStore.getSocialPostCategories).pipe(
      take(1),
      mergeMap((categories) => {
        if (!categories.length) {
          const _search = new HttpParams().append(
            'school_id',
            this.session.g.get('school').id.toString()
          );

          return this.service
            .getChannelsBySchoolId(1, 1000, _search)
            .pipe(
              tap((results: any) =>
                this.store.dispatch(fromStore.setSocialPostCategories({ categories: results }))
              )
            );
        }
        return of(categories);
      })
    );

    return combineLatest([campusThread$, channels$]).pipe(map(([trheads]) => trheads));
  }

  ngOnInit() {
    const posts$ = this.store.pipe(select(fromStore.getThreads));
    const results$ = this.store.pipe(select(fromStore.getResults));
    const comments$ = this.store.pipe(select(fromStore.getComments));
    const filters$ = this.store.pipe(select(fromStore.getViewFilters));
    /**
     * whenever either of these observables
     * emits iterate over the results and append the
     * correspondant object (comment, thread) as long
     * as it still active, clean up the potential undefined
     * results at the end
     */
    const searchResults$ = combineLatest([results$, posts$, comments$]).pipe(
      filter(([results]) => Boolean(results.length)),
      map(([results, posts, comments]) => {
        return results
          .map(({ id, type, children }) => {
            if (type === 'COMMENT') {
              return comments.find((c) => c.id === id);
            }
            const thread = posts.find((p) => p.id === id);
            return !children
              ? thread
              : {
                  ...thread,
                  children: comments.filter((comment) => children.includes(comment.id))
                };
          })
          .filter((r) => r);
      })
    );

    /**
     * prevent new posts from being added to the list
     * while filtering by Flagged/Removed posts or while
     * performing a search
     */
    const regularThreads$ = combineLatest([posts$, filters$, results$]).pipe(
      map(([posts, filters, results]) => {
        if (results.length) {
          const resultPostIds = results.filter((r) => r.type === 'THREAD').map((r) => r.id);
          return posts.filter((p) => resultPostIds.includes(p.id));
        }

        const { flaggedByUser, flaggedByModerators } = filters;
        if (flaggedByUser) {
          return posts.filter((p) => p.dislikes > 0);
        }
        if (flaggedByModerators) {
          return posts.filter((p) => p.flag === -3);
        }
        return posts;
      })
    );

    /**
     * whenever either of these
     * observables emits update the list
     */
    this.results$ = merge(regularThreads$, searchResults$);

    this.fetchBannedEmails();
  }

  ngOnDestroy() {
    this.store.dispatch(fromStore.resetState());
  }

  fetchBannedEmails() {
    const params = new HttpParams().set('school_id', this.session.school.id.toString());
    this.userService
      .getAll(params, 1, 10000)
      .pipe(
        map((students: any[]) => students.filter((s) => s.social_restriction).map((s) => s.email))
      )
      .subscribe(
        (emails) => this.store.dispatch(fromStore.setBannedEmails({ emails })),
        () => this.store.dispatch(fromStore.setBannedEmails({ emails: [] }))
      );
  }
}
