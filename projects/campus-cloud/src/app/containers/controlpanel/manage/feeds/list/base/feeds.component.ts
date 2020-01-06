import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { map, switchMap, filter } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../feeds.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { FeedsAmplitudeService } from './../../feeds.amplitude.service';
import { GroupType, FeedsUtilsService } from '../../feeds.utils.service';
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
export class FeedsComponent extends BaseComponent implements OnInit {
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
  isCampusWallView$: BehaviorSubject<any> = new BehaviorSubject({
    type: 1,
    group_id: null
  });

  constructor(
    public session: CPSession,
    public service: FeedsService,
    public cpTracking: CPTrackingService
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

    const matchingResources$ = this.service.searchCampusWall(
      this.startRange,
      this.endRange,
      searchCampusParam
    );

    const stream$ = matchingResources$.pipe(
      switchMap((results: SocialWallContent[]) => {
        const campusThreadIds = results
          .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.campusThread)
          .map((r: SocialWallContent) => r.id);

        const groupThreadIds = results
          .filter((r: SocialWallContent) => r.obj_type === SocialWallContentObjectType.groupThread)
          .map((r: SocialWallContent) => r.id);

        /**
         * dont call the api unless we have matching results
         */
        if (this.state.isCampusThread && !campusThreadIds.length) {
          return of([]);
        } else if (!this.state.isCampusThread && !groupThreadIds.length) {
          return of([]);
        }

        let threadSearch = this.getFilterParams();

        threadSearch = this.state.isCampusThread
          ? threadSearch
              .set('school_id', this.session.g.get('school').id.toString())
              .set('thread_ids', campusThreadIds.join(','))
          : threadSearch
              .set('group_id', this.state.wall_type.toString())
              .set('group_thread_ids', groupThreadIds.join(','));

        /**
         * Convert the array of SocialWallContent into an object
         * whose keys are the resources IDs and the value is the highlighted content
         */
        const replaceMatchedContent = (threads) => {
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
                message: description ? description[0] : thread.description
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

        const channels$ = this.service.getChannelsBySchoolId(1, 1000, schoolParam);

        const groupThreads$ = this.service.getGroupThreadsByIds(threadSearch).pipe(
          filter((threads: any) => threads.filter((t) => t.group_id === this.state.group_id)),
          map((threads) => orderBasedOnElasticSearchScore(replaceMatchedContent(threads)))
        );

        const campusThreads$ = combineLatest([
          this.service.getCampusThreadByIds(threadSearch),
          channels$
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

            threads = threads.map((t) => {
              return {
                ...t,
                channelName: this.getChannelNameFromArray(channels, t)
              };
            });
            return orderBasedOnElasticSearchScore(replaceMatchedContent(threads));
          })
        );

        const threads$ = this.state.isCampusThread ? campusThreads$ : groupThreads$;

        return threads$;
      })
    );

    super
      .fetchData(stream$)
      .then((res) => {
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_SEARCHED_INFORMATION, amplitude);
        this.state = Object.assign({}, this.state, { feeds: res.data });
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
    this.isCampusWallView$.next({
      type: data.wall_type,
      group_id: data.group_id
    });

    // filter by removed posts
    if (data.removed_by_moderators_only) {
      this.isFilteredByRemovedPosts$.next(true);
    } else {
      this.isFilteredByRemovedPosts$.next(false);
    }

    // filter by flagged posts
    if (data.flagged_by_users_only) {
      this.isFilteredByFlaggedPosts$.next(true);
    } else {
      this.isFilteredByFlaggedPosts$.next(false);
    }

    this.state = Object.assign({}, this.state, {
      group_id: data.group_id,
      wall_type: data.wall_type,
      post_types: data.post_types,
      currentView: data.currentView,
      is_integrated: data.is_integrated,
      isCampusThread: data.wall_type === 1,
      flagged_by_users_only: data.flagged_by_users_only,
      removed_by_moderators_only: data.removed_by_moderators_only
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
        this.state = Object.assign({}, this.state, { feeds: res.data });
      })
      .catch((_) => null);
  }

  doAdvancedSearch(search) {
    let stream$;

    const groupThread$ = this.service.getGroupWallFeeds(this.startRange, this.endRange, search);
    const campusThread$ = this.service.getCampusWallFeeds(this.startRange, this.endRange, search);

    if (this.state.isCampusThread) {
      const _search = new HttpParams().append(
        'school_id',
        this.session.g.get('school').id.toString()
      );

      const channels$ = this.service.getChannelsBySchoolId(1, 1000, _search);

      stream$ = combineLatest([campusThread$, channels$]).pipe(
        map((res: any) => {
          const result = [];
          const threads = res[0];
          this.channels = res[1];

          threads.forEach((thread) => {
            result.push({
              ...thread,
              channelName: this.getChannelNameFromArray(this.channels, thread)
            });
          });

          return result;
        })
      );
    } else {
      return groupThread$;
    }

    return stream$;
  }

  getChannelNameFromArray(channels, thread) {
    let name;
    channels.filter((channel) => {
      if (channel.id === thread.post_type) {
        name = channel.name;
      }
    });

    return name;
  }

  onCreated(feed) {
    // do not append to list if currently filtering by flagged or removed posts
    if (this.isFilteredByRemovedPosts$.value || this.isFilteredByFlaggedPosts$.value) {
      return;
    }

    let channelName;

    if (this.state.isCampusThread) {
      channelName = this.getChannelNameFromArray(this.channels, feed);
    }

    feed = Object.assign({}, feed, {
      ...feed,
      channelName
    });

    this.state = Object.assign({}, this.state, {
      feeds: [feed, ...this.state.feeds]
    });
  }

  onEdited(feed) {
    const _state = Object.assign({}, this.state, {
      feeds: this.state.feeds.map((_feed) => {
        if (_feed.id === feed.id) {
          return (_feed = feed);
        }

        return _feed;
      })
    });

    this.state = Object.assign({}, this.state, _state);
  }

  onDeleted(feedId: number) {
    const _state = Object.assign({}, this.state);

    _state.feeds = _state.feeds.filter((feed) => feed.id !== feedId);

    this.state = Object.assign({}, this.state, { feeds: _state.feeds });
  }

  ngOnInit() {}
}
