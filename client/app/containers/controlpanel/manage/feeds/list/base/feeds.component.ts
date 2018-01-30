import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../feeds.service';
import { CPSession } from '../../../../../../session';
import { BaseComponent } from '../../../../../../base/base.component';

interface ICurrentView {
  label: string;
  action: number;
  group_id: number;
  commentingMemberType: number;
  postingMemberType: number;
}

interface IState {
  group_id: number;
  wall_type: number;
  feeds: Array<any>;
  post_types: number;
  isCampusThread: boolean;
  currentView?: ICurrentView;
  flagged_by_users_only: number;
  removed_by_moderators_only: number;
}

const state: IState = {
  feeds: [],
  post_types: 1,
  group_id: null,
  wall_type: null,
  currentView: null,
  isCampusThread: true,
  flagged_by_users_only: null,
  removed_by_moderators_only: null,
};

@Component({
  selector: 'cp-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss'],
})
export class FeedsComponent extends BaseComponent implements OnInit {
  @Input() clubId: number;
  @Input() selectedItem: any;
  @Input() isClubsView: boolean;

  feeds;
  groups;
  isSimple;
  channels;
  loading = true;
  disablePost = 100;
  state: IState = state;
  isFilteredByRemovedPosts$: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );
  isFilteredByFlaggedPosts$: BehaviorSubject<boolean> = new BehaviorSubject(
    false,
  );
  isCampusWallView$: BehaviorSubject<any> = new BehaviorSubject({
    type: 1,
    group_id: null,
  });

  constructor(public session: CPSession, public service: FeedsService) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onFilterByCategory(category) {
    this.onDoFilter(category);
    this.setItemInCategory(category);
  }

  onDoFilter(data) {
    this.isCampusWallView$.next({
      type: data.wall_type,
      group_id: data.group_id,
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
      isCampusThread: data.wall_type === 1,
      flagged_by_users_only: data.flagged_by_users_only,
      removed_by_moderators_only: data.removed_by_moderators_only,
    });

    this.fetch();
  }

  setItemInCategory(category) {
    this.selectedItem = category;
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  private fetch() {
    const search = new URLSearchParams();

    const flagged = this.state.flagged_by_users_only
      ? this.state.flagged_by_users_only.toString()
      : null;

    const removed = this.state.removed_by_moderators_only
      ? this.state.removed_by_moderators_only.toString()
      : null;

    const type = this.state.post_types
      ? this.state.post_types.toString()
      : null;

    search.append('post_types', type);
    search.append('flagged_by_users_only', flagged);
    search.append('removed_by_moderators_only', removed);

    if (this.state.isCampusThread) {
      search.append('school_id', this.session.g.get('school').id.toString());
    } else {
      search.append('group_id', this.state.wall_type.toString());
    }

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

    const groupThread$ = this.service.getGroupWallFeeds(
      this.startRange,
      this.endRange,
      search,
    );
    const campusThread$ = this.service.getCampusWallFeeds(
      this.startRange,
      this.endRange,
      search,
    );

    if (this.state.isCampusThread) {
      const _search = new URLSearchParams();
      _search.append('school_id', this.session.g.get('school').id.toString());

      const channels$ = this.service.getChannelsBySchoolId(1, 1000, _search);

      stream$ = Observable.combineLatest(campusThread$, channels$).map(
        (res) => {
          const result = [];
          const threads = res[0];
          this.channels = res[1];

          threads.forEach((thread) => {
            result.push({
              ...thread,
              channelName: this.getChannelNameFromArray(this.channels, thread),
            });
          });

          return result;
        },
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
    if (
      this.isFilteredByRemovedPosts$.value ||
      this.isFilteredByFlaggedPosts$.value
    ) {
      return;
    }

    let channelName;

    if (this.state.isCampusThread) {
      channelName = this.getChannelNameFromArray(this.channels, feed);
    }

    feed = Object.assign({}, feed, {
      ...feed,
      channelName,
    });

    this.state = Object.assign({}, this.state, {
      feeds: [feed, ...this.state.feeds],
    });
  }

  onEdited(feed) {
    const _state = Object.assign({}, this.state, {
      feeds: this.state.feeds.map((_feed) => {
        if (_feed.id === feed.id) {
          return (_feed = feed);
        }

        return _feed;
      }),
    });

    this.state = Object.assign({}, this.state, _state);
  }

  onDeleted(feedId: number) {
    const _state = Object.assign({}, this.state);

    _state.feeds = _state.feeds.filter((feed) => feed.id !== feedId);

    this.state = Object.assign({}, this.state, { feeds: _state.feeds });
  }

  ngOnInit() {
    this.isSimple = this.isClubsView;
  }
}
