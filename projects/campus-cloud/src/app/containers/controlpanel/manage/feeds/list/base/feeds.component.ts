import { BehaviorSubject, combineLatest, of, zip, Observable, merge, Subject } from 'rxjs';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store, select } from '@ngrx/store';
import { isEqual } from 'lodash';
import {
  map,
  tap,
  take,
  share,
  filter,
  mergeMap,
  switchMap,
  takeUntil,
  startWith,
  catchError,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';

import * as fromStore from '../../store';
import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../feeds.service';
import { GroupType } from '../../feeds.utils.service';
import { appStorage } from '@campus-cloud/shared/utils';
import { FeedsUtilsService } from '../../feeds.utils.service';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { FeedsSearchUtilsService } from '../../feeds-search.utils.service';
import { UserService, StoreService, ReadyStore } from '@campus-cloud/shared/services';
import {
  ISocialGroup,
  ICampusThread,
  SocialWallContent,
  ISocialGroupThread,
  ICampusThreadComment,
  ISocialGroupThreadComment,
  SocialWallContentObjectType
} from '@controlpanel/manage/feeds/model';

interface IState {
  orderBy: string;
  group_id: number;
  feeds: Array<any>;
  searchTerm: string;
  post_types: number;
  user_ids: number[];
  end: null | number;
  start: null | number;
  is_integrated: boolean;
  isCampusThread: boolean;
  flagged_by_users_only: number;
  removed_by_moderators_only: number;
}

const state: IState = {
  feeds: [],
  end: null,
  start: null,
  user_ids: [],
  searchTerm: '',
  post_types: 1,
  group_id: null,
  orderBy: 'score',
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
  @Input() groupType: GroupType;
  @Input() hideIntegrations = false;

  view$: Observable<{
    results: any[];
    loading: boolean;
    host: ReadyStore;
    searching: boolean;
    state: 'default' | 'search';
    socialGroup: ISocialGroup;
  }>;

  channels;
  loading = true;
  disablePost = 100;
  state: IState = state;
  destroy$ = new Subject();
  loading$: Observable<boolean>;
  searching: Subject<boolean> = new Subject();
  filters$ = this.store.pipe(select(fromStore.getViewFilters));
  isFilteredByFlaggedPosts$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  selectedHost$: Observable<ReadyStore> = this.store.pipe(select(fromStore.getHost));
  results$: Observable<Array<{ id: number; type: string; children?: number[] }> | any[]>;
  isCampusWallView$: BehaviorSubject<any> = new BehaviorSubject({
    type: 1,
    group_id: null
  });

  constructor(
    public session: CPSession,
    public service: FeedsService,
    public userService: UserService,
    public store: Store<fromStore.IWallsState>,
    public storeService: StoreService
  ) {
    super();
  }

  trackByFn(_: number, item) {
    return item.id;
  }

  hasFilters() {
    const {
      end,
      start,
      user_ids,
      group_id,
      post_types,
      flagged_by_users_only,
      removed_by_moderators_only
    } = this.state;

    return (
      !!end ||
      !!start ||
      !!group_id ||
      !!post_types ||
      !!user_ids.length ||
      !!flagged_by_users_only ||
      !!removed_by_moderators_only
    );
  }

  sortingHandler(orderBy) {
    this.state = { ...this.state, orderBy };
    const { searchTerm } = this.state;
    this.searchHandler(searchTerm);
  }

  getSocialObjectsFromSocialWallContentResponse(
    results: SocialWallContent[]
  ): Observable<
    (ICampusThread | ICampusThreadComment | ISocialGroupThread | ISocialGroupThreadComment)[]
  > {
    /**
     * get all ids to be used to call each endpoint separately
     */
    const {
      groupThreadIds,
      campusThreadIds,
      groupThreadCommentIds,
      campusThreadCommentIds
    } = FeedsSearchUtilsService.getThreadIdsBySocialWallContentResults(results);

    /**
     * dont call the api unless we have matching results
     */
    if (this.state.isCampusThread && !campusThreadIds.length && !campusThreadCommentIds.length) {
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
          .set('group_id', this.state.group_id.toString())
          .set('group_thread_ids', groupThreadIds.length ? groupThreadIds.join(',') : null)
          .set(
            'comment_ids',
            groupThreadCommentIds.length ? groupThreadCommentIds.join(',') : null
          );

    const groupThreads$ = this.service
      .getGroupThreadsByIds(threadSearch)
      .pipe(filter((threads: any) => threads.filter((t) => t.group_id === this.state.group_id)));

    const groupComments$ = this.service
      .getGroupCommentsByIds(threadSearch)
      .pipe(filter((threads: any) => threads.filter((t) => t.group_id === this.state.group_id)));

    const campusThreads$ = this.service.getCampusThreadByIds(threadSearch);
    const campusComments$ = this.service.getCampusCommentsByIds(threadSearch);

    const campusWallResults$ = zip(campusThreads$, campusComments$);
    const socialGroupResults$ = zip(groupThreads$, groupComments$);

    const threads$ = this.state.isCampusThread ? campusWallResults$ : socialGroupResults$;

    return threads$.pipe(
      map(
        ([threads, comments]: [
          (ISocialGroupThread | ICampusThread)[],
          (ICampusThreadComment | ISocialGroupThreadComment)[]
        ]) => {
          const orderedResults = FeedsSearchUtilsService.enforceSocialWallContentOrder(results, [
            ...threads,
            ...comments
          ]);
          return orderedResults;
        }
      )
    );
  }

  searchHandler(searchTerm: string) {
    searchTerm = searchTerm.trim();

    // if searchTerm is empty do regular search
    if (!searchTerm) {
      this.state = {
        ...this.state,
        searchTerm: ''
      };
      this.store.dispatch(fromStore.setResults({ results: [] }));
      this.store.dispatch(fromStore.setSearchTerm({ term: '' }));
      this.resetPagination();
      this.fetch();
      return;
    }

    if (this.pageNumber > 1 && !this.state.searchTerm) {
      this.resetPagination();
    }

    this.searching.next(true);

    this.state = {
      ...this.state,
      searchTerm
    };

    this.store.dispatch(fromStore.setSearchTerm({ term: searchTerm }));

    const validObjectTypes = [];

    if (!this.state.isCampusThread) {
      validObjectTypes.push(
        SocialWallContentObjectType.groupComment,
        SocialWallContentObjectType.groupThread
      );
    } else {
      validObjectTypes.push(
        SocialWallContentObjectType.campusThread,
        SocialWallContentObjectType.campusComment
      );
    }
    let schoolParam = this.getFilterParams();
    schoolParam = schoolParam.set('school_id', this.session.school.id.toString());

    let searchCampusParam: HttpParams = !this.state.isCampusThread
      ? schoolParam.set('group_id', this.state.group_id.toString())
      : schoolParam;

    searchCampusParam = searchCampusParam
      .set('obj_types', validObjectTypes.join(','))
      .set('search_str', searchTerm)
      .set('order_by', this.state.orderBy.toString());

    /**
     * do ranged search on all valid object types
     */
    const matchingResources$ = this.service
      .searchCampusWall(this.startRange, this.endRange, searchCampusParam)
      .pipe(map((results) => super.updatePagination(results)));

    const stream$ = matchingResources$.pipe(
      switchMap((results: SocialWallContent[]) => {
        return this.getSocialObjectsFromSocialWallContentResponse(results).pipe(
          map((threadsAndComments) =>
            FeedsSearchUtilsService.replaceMatchedContent(threadsAndComments, results)
          )
        );
      })
    );

    stream$.pipe(takeUntil(this.destroy$)).subscribe(
      (results) => {
        this.searching.next(false);
        this.store.dispatch(fromStore.setResults({ results }));
        this.state = Object.assign({}, this.state, {
          feeds: FeedsUtilsService.groupThreads(results)
        });
      },
      () => {
        this.searching.next(false);
        this.state = Object.assign({}, this.state, { feeds: [] });
      }
    );
  }

  onFilterByCategory(category) {
    this.onDoFilter(category);
  }

  onDoFilter(data) {
    const {
      end,
      start,
      user_ids,
      group_id,
      searchTerm,
      post_types,
      is_integrated,
      related_obj_id,
      flagged_by_users_only,
      removed_by_moderators_only
    } = data;

    // TODO: fix this
    this.isCampusWallView$.next({
      type: !post_types && !group_id ? 1 : group_id ? group_id : 1,
      group_id: related_obj_id
    });

    // filter by flagged posts
    if (flagged_by_users_only) {
      this.isFilteredByFlaggedPosts$.next(true);
    } else {
      this.isFilteredByFlaggedPosts$.next(false);
    }

    this.state = Object.assign({}, this.state, {
      end,
      start,
      user_ids,
      searchTerm,
      group_id: group_id,
      post_types: post_types,
      is_integrated: is_integrated,
      isCampusThread: group_id === null,
      flagged_by_users_only: flagged_by_users_only,
      removed_by_moderators_only: removed_by_moderators_only
    });

    if (this.state.searchTerm) {
      this.searchHandler(this.state.searchTerm);
      return;
    }
    this.fetch();
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    if (this.state.searchTerm) {
      this.searchHandler(this.state.searchTerm);
    } else {
      this.fetch();
    }
  }

  private getFilterParams(): HttpParams {
    const nullOrString = (stateKey: string) =>
      this.state[stateKey] ? this.state[stateKey].toString() : null;

    const end = nullOrString('end');
    const start = nullOrString('start');

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
      .set('removed_by_moderators_only', removed)
      .set('end', start && end ? this.state.end.toString() : null)
      .set('start', start && end ? this.state.start.toString() : null)
      .set('user_ids', this.state.user_ids.length ? this.state.user_ids.join(',') : null);
  }

  private fetch() {
    let search = this.getFilterParams();
    const hasFilters = this.hasFilters();

    const validObjectTypes = [];

    if (!this.state.isCampusThread) {
      validObjectTypes.push(SocialWallContentObjectType.groupThread);
      if (hasFilters) {
        validObjectTypes.push(SocialWallContentObjectType.groupComment);
      }
    } else {
      validObjectTypes.push(SocialWallContentObjectType.campusThread);
      if (hasFilters) {
        validObjectTypes.push(SocialWallContentObjectType.campusComment);
      }
    }
    search = this.state.isCampusThread
      ? search.append('school_id', this.session.g.get('school').id.toString())
      : search.append('group_id', this.state.group_id.toString());

    search = search.set('obj_types', validObjectTypes.join(','));

    const stream$ = this.doAdvancedSearch(search);

    super
      .fetchData(stream$)
      .then(({ data }) => this.store.dispatch(fromStore.setResults({ results: data })))
      .catch((_) => null);
  }

  doAdvancedSearch(search) {
    const results$ = this.service
      .searchCampusWall(this.startRange, this.endRange, search)
      .pipe(switchMap(this.getSocialObjectsFromSocialWallContentResponse.bind(this)));

    if (!this.state.isCampusThread) {
      return results$;
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

    return combineLatest([results$, channels$]).pipe(map(([results]) => results));
  }

  ngOnInit() {
    const filters$ = this.filters$.pipe(
      /**
       * avoid mulliple emitions when switching boolean values
       * eg: from status Deleted to Flagged this emits once to set
       * Deleted to false and then again to set Flagged to true
       */
      debounceTime(350),
      filter(({ end, start }) => (end || start ? end !== null && start !== null : true))
    );

    /**
     * when rendered inside a host wall (service, clubs...)
     * we need to fetch the Social Group from the groupId @Input()
     */
    let hostSocialGroup$: Observable<any> = of(null);

    if (this.groupId) {
      const search = new HttpParams()
        .append('school_id', this.session.g.get('school').id.toString())
        .append(
          this.groupType === GroupType.orientation ? 'calendar_id' : 'store_id',
          this.groupId.toString()
        );
      hostSocialGroup$ = this.service
        .getSocialGroups(search)
        .pipe(tap((groups) => this.store.dispatch(fromStore.setGroup({ group: groups[0] }))));
    }

    /**
     * call onDoFilter (temporarily, will be replaced with a call to fetch)
     * whenever the viewFilterState changes 'select' emits any time the state
     * changes, thus we need to ensure the prevState !== currentState to avoid 503's
     */
    const uniqueFilterChanges$ = filters$.pipe(
      distinctUntilChanged((prevState, currentState) => isEqual(prevState, currentState))
    );

    hostSocialGroup$
      .pipe(
        switchMap(() => uniqueFilterChanges$),
        takeUntil(this.destroy$)
      )
      .subscribe((filters) => {
        const {
          users,
          group,
          start,
          end,
          postType,
          searchTerm,
          flaggedByModerators,
          flaggedByUser
        } = filters;

        const filtersObj = {
          end,
          start,
          searchTerm,
          user_ids: users.map((u) => u.id),
          group_id: group ? group.id : null,
          post_types: postType ? postType.id : null,
          flagged_by_users_only: flaggedByUser ? 1 : null,
          related_obj_id: group ? group.related_obj_id : null,
          is_integrated: postType ? postType.is_integrated : false,
          removed_by_moderators_only: flaggedByModerators ? 1 : null
        };
        this.onDoFilter(filtersObj);
      });

    this.loading$ = merge(super.isLoading(), this.searching.asObservable()).pipe(startWith(true));

    const posts$ = this.store.pipe(select(fromStore.getThreads)).pipe(share());
    const results$ = this.store.pipe(select(fromStore.getResults)).pipe(share());
    const comments$ = this.store.pipe(select(fromStore.getComments)).pipe(share());

    const newPosts$ = posts$.pipe(distinctUntilChanged());
    const resultObjs$ = combineLatest([posts$, results$, comments$]).pipe(
      filter(() => this.hasFilters() || this.state.searchTerm !== ''),
      map(([posts, results, comments]) => {
        return results.map(({ id, type }) => {
          if (type === 'COMMENT') {
            return comments.find((c) => c.id === id);
          }

          return posts.find((c) => c.id === id);
        });
      })
    );

    this.results$ = merge(newPosts$, resultObjs$);

    const storedHost = appStorage.get(appStorage.keys.WALLS_DEFAULT_HOST);

    let storedHost$ = of(null);
    if (storedHost) {
      const { id } = JSON.parse(storedHost);
      const params = new HttpParams().set('school_id', this.session.school.id.toString());

      storedHost$ = this.storeService.getStoreById(id, params).pipe(
        catchError(() => of(null)),
        tap((host) => this.store.dispatch(fromStore.setHost({ host }))),
        startWith(of(null))
      );
    }

    this.fetchBannedEmails();
    this.getGroups();
    this.view$ = combineLatest([
      this.loading$,
      this.results$,
      storedHost$,
      this.filters$,
      this.selectedHost$
    ]).pipe(
      map(([loading, results, host, { group, searchTerm }, selectedHost]) => ({
        host: selectedHost ? selectedHost : host,
        results,
        loading,
        socialGroup: group,
        searching: searchTerm !== '',
        state: this.hasFilters() || this.state.searchTerm !== '' ? 'search' : 'default'
      }))
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getGroups() {
    const params = new HttpParams().set('school_id', this.session.school.id.toString());
    this.service
      .getSocialGroups(params)
      .pipe(
        map((groups: ISocialGroup[]) => groups.map((g) => g.related_obj_id)),
        tap((groups) => this.store.dispatch(fromStore.setSocialGroupIds({ groupIds: groups }))),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  fetchBannedEmails() {
    const { is_sandbox, client_id } = this.session.g.get('school');
    const params = new HttpParams().set('client_id', client_id).set('is_sandbox', is_sandbox);
    this.userService
      .getAll(params, 1, 10000)
      .pipe(
        map((students: any[]) =>
          students
            .filter((s) => s.social_restriction_school_ids.length)
            .filter(({ social_restriction_school_ids }) =>
              social_restriction_school_ids.includes(this.session.school.id)
            )
            .map((s) => s.email)
        )
      )
      .subscribe(
        (emails) => this.store.dispatch(fromStore.setBannedEmails({ emails })),
        () => this.store.dispatch(fromStore.setBannedEmails({ emails: [] }))
      );
  }
}
