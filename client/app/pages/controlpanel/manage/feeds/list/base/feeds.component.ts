import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../feeds.service';
import { BaseComponent } from '../../../../../../base/base.component';

interface IState {
  group_id: number;
  wall_type: number;
  feeds: Array<any>;
  post_types: number;
  isCampusThread: boolean;
  flagged_by_users_only: number;
}

const state: IState = {
  feeds: [],
  group_id: null,
  wall_type: null,
  post_types: null,
  isCampusThread: true,
  flagged_by_users_only: null
};

@Component({
  selector: 'cp-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent extends BaseComponent implements OnInit {
  feeds;
  loading;
  isSimple;
  school_id = 157;
  state: IState = state;
  isCampusWallView$: BehaviorSubject<number> = new BehaviorSubject(1);

  constructor(
    public service: FeedsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onDoFilter(data) {
    if (data.wall_type !== 1) {
      this.isCampusWallView$.next(data.wall_type);
    } else {
      this.isCampusWallView$.next(data.wall_type);
    }

    this.state = Object.assign(
      {},
      this.state,
      {
        group_id: data.group_id,
        wall_type: data.wall_type,
        post_types: data.post_types,
        isCampusThread: data.wall_type === 1 ? true : false,
        flagged_by_users_only: data.flagged_by_users_only
      }
    );

    this.fetch();
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
    let search = new URLSearchParams();
    let flagged = this.state.flagged_by_users_only ?
      this.state.flagged_by_users_only.toString() : null;

    let type = this.state.post_types ?
      this.state.post_types.toString() : null;

    search.append('post_types', type);
    search.append('flagged_by_users_only', flagged);

    if (this.state.isCampusThread) {
      search.append('school_id', this.school_id.toString());
    } else {
      search.append('group_id', this.state.wall_type.toString());
    }

    // let groupThread$ = this.service.getGroupWallFeeds(this.startRange, this.endRange, search);
    // let campusThread$ = this.service.getCampusWallFeeds(this.startRange, this.endRange, search);

    // let stream$ = this.state.isCampusThread ? campusThread$ : groupThread$;
    let stream$ = this.doAdvancedSearch(search);

    super
      .fetchData(stream$)
      .then(res => {
        this.state = Object.assign({}, this.state, { feeds: res.data });
      })
      .catch(err => console.log(err));
  }

  doAdvancedSearch(search) {
    let stream$;

    let groupThread$ = this.service.getGroupWallFeeds(this.startRange, this.endRange, search);
    let campusThread$ = this.service.getCampusWallFeeds(this.startRange, this.endRange, search);

    if (this.state.isCampusThread) {
      let _search = new URLSearchParams();
      _search.append('school_id', this.school_id.toString());

      let channels$ = this.service.getChannelsBySchoolId(1, 1000, _search);

      stream$ =
        Observable
          .combineLatest(campusThread$, channels$)
          .map(res => {
            let result = [];
            let threads = res[0];
            let channels = res[1];


            threads.forEach(thread => {
              result.push({
                ...thread,
                channelName: this.getChannelNameFromArray(channels, thread)
              });
            });
            return result;
          });
    } else {
      let _search = new URLSearchParams();
      _search.append('school_id', this.school_id.toString());

      let groups$ = this.service.getSocialGroups(_search);

      stream$ =
        Observable
          .combineLatest(groupThread$, groups$)
          .map(res => {
            let result = [];
            let threads = res[0];
            let groups = res[1];

            threads.forEach(thread => {
              result.push({
                ...thread,
                channelName: this.getGroupNameFromArray(groups, thread)
              });
            });

            return result;
          });
    }

    return stream$;
  }

  getChannelNameFromArray(channels, thread) {
    let name;
    channels.filter(channel => {
      if (channel.id === thread.post_type) {
        name = channel.name;
      }
    });
    return name;
  }

  getGroupNameFromArray(groups, thread) {
    let name;
    groups.filter(group => {
      if (group.id === thread.group_id) {
        name = group.name;
      }
    });
    return name;
  }

  onCreated(feed) {
    this.state = Object.assign(
      {},
      this.state,
      { feeds: [feed, ...this.state.feeds] }
    );
  }

  onEdited(feed) {
    let _state = Object.assign({}, this.state, {
      feeds: this.state.feeds.map(_feed => {
        if (_feed.id === feed.id) {
          return _feed = feed;
        }
        return _feed;
      })
    });

    this.state = Object.assign({}, this.state, _state);
  }

  onDeleted(feedId: number) {
    let _state = Object.assign({}, this.state);

    _state.feeds = _state.feeds.filter(feed => feed.id !== feedId);

    this.state = Object.assign({}, this.state, { feeds: _state.feeds });
  }

  ngOnInit() { }
}
