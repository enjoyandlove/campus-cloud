import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../../feeds.service';
import { CPSession } from '../../../../../../../session';

interface IState {
  group_id: number;
  wall_type: number;
  post_types: number;
  postingMemberType: number;
  commentingMemberType: number;
  flagged_by_users_only: number;
  removed_by_moderators_only: number;
}

const state: IState = {
  wall_type: 1,
  group_id: null,
  post_types: null,
  postingMemberType: null,
  commentingMemberType: null,
  flagged_by_users_only: null,
  removed_by_moderators_only: null
};

@Component({
  selector: 'cp-feed-filters',
  templateUrl: './feed-filters.component.html',
  styleUrls: ['./feed-filters.component.scss']
})
export class FeedFiltersComponent implements OnInit {
  @Input() clubId: number;
  @Output() doFilter: EventEmitter<IState> = new EventEmitter();

  posts;
  channels;
  channels$;
  state: IState;
  walls$: Observable<any>;

  constructor(
    private session: CPSession,
    private feedsService: FeedsService,
  ) {
    this.state = state;
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this.walls$ = this.feedsService.getSocialGroups(search)
      .startWith([
        {
          label: 'Campus Wall',
          action: 1
        }
      ])
      .map(groupWalls => {
        let _walls = [
          {
            label: 'Campus Wall',
            action: 1
          }
        ];

        groupWalls.forEach(wall => {
          let _wall = {
            label: wall.name,
            action: wall.id,
            commentingMemberType: wall.min_commenting_member_type,
            postingMemberType: wall.min_posting_member_type,
            group_id: wall.related_obj_id
          };

          _walls.push(_wall);
        });

        return _walls;
      });

    this.channels$ = this.feedsService.getChannelsBySchoolId(1, 1000, search)
      .startWith([{ label: 'All' }])
      .map(channels => {
        let _channels = [
          {
            label: 'All',
            action: null
          }
        ];

        channels.forEach(channel => {
          let _channel = {
            label: channel.name,
            action: channel.id
          };

          _channels.push(_channel);
        });

        return _channels;
      });
  }

  onFlaggedOrRemoved(action) {
    switch (action) {
      case 1:
        this.state = Object.assign(
          {},
          this.state,
          {
            flagged_by_users_only: 1,
            removed_by_moderators_only: null
          }
        );
        break;

      case 2:
        this.state = Object.assign(
          {},
          this.state,
          {
            flagged_by_users_only: null,
            removed_by_moderators_only: 1
          }
        );
        break;

      default:
        this.state = Object.assign(
          {},
          this.state,
          {
            flagged_by_users_only: null,
            removed_by_moderators_only: null
          }
        );
    }
    this.doFilter.emit(this.state);
  }

  onUpdateWallSettings(wall) {
    this.state = Object.assign(
      {},
      this.state,
      {
        postingMemberType: wall.min_posting_member_type,
        commentingMemberType: wall.min_commenting_member_type,
      }
    );


    this.doFilter.emit(this.state);
  }

  onFilterSelected(item, type) {
    this.state = Object.assign(
      {},
      this.state,
      {
        group_id: item.group_id ? item.group_id : null,
        postingMemberType: item.postingMemberType ? item.postingMemberType : true,
        commentingMemberType: item.commentingMemberType ? item.commentingMemberType : true,
      }
    );
    this.updateState(type, item.action);
  }

  updateState(key: string, value: any) {
    this.state = Object.assign({}, this.state, { [key]: value });
    this.doFilter.emit(this.state);
  }

  ngOnInit() {
    this.posts = [
      {
        label: 'All Posts',
        action: null
      },
      {
        label: 'Flagged Posts',
        action: 1
      },
      {
        label: 'Removed Posts',
        action: 2
      }
    ];

    if (this.clubId) {
      let search = new URLSearchParams();
      search.append('school_id', this.session.school.id.toString());
      search.append('store_id', this.clubId.toString());

      let getGroup = this.feedsService.getSocialGroups(search).toPromise();

      getGroup.then(groups => {
        let group = groups[0];
        this.state = Object.assign(
          {},
          this.state,
          {
            wall_type: group.id,
            group_id: this.clubId,
            flagged_by_users_only: null,
            removed_by_moderators_only: null,
            postingMemberType: group.min_posting_member_type,
            commentingMemberType: group.min_commenting_member_type
          }
        );

        this.doFilter.emit(this.state);
      });
      return;
    }

    this.fetch();
    this.doFilter.emit(this.state);
  }
}
