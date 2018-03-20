import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../../feeds.service';

import { CPSession } from '../../../../../../../session';

import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

const campusWall = {
  label: 'Campus Wall',
  action: 1,
  group_id: null,
  commentingMemberType: null,
  postingMemberType: null,
};

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
  post_types: number;
  currentView?: ICurrentView;
  flagged_by_users_only: number;
  removed_by_moderators_only: number;
}

const state: IState = {
  wall_type: 1,
  group_id: null,
  post_types: null,
  currentView: campusWall,
  flagged_by_users_only: null,
  removed_by_moderators_only: null,
};

@Component({
  selector: 'cp-feed-filters',
  templateUrl: './feed-filters.component.html',
  styleUrls: ['./feed-filters.component.scss'],
})
export class FeedFiltersComponent implements OnInit {
  @Input() clubId: number;
  @Input() orientationId: number;
  @Input() selectedItem: any;

  @Output() doFilter: EventEmitter<IState> = new EventEmitter();

  posts;
  channels;
  channels$;
  state: IState;
  socialGroups = [];
  walls$: Observable<any>;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private feedsService: FeedsService,
  ) {
    this.state = state;
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.walls$ = this.feedsService
      .getSocialGroups(search)
      .startWith([
        {
          label: this.cpI18n.translate('campus_wall'),
          action: 1,
        },
      ])
      .map((groupWalls) => {
        const _walls = [
          {
            label: this.cpI18n.translate('campus_wall'),
            action: 1,
          },
        ];

        groupWalls.forEach((wall) => {
          const _wall = {
            label: wall.name,
            action: wall.id,
            commentingMemberType: wall.min_commenting_member_type,
            postingMemberType: wall.min_posting_member_type,
            group_id: wall.related_obj_id,
          };
          this.socialGroups.push(_wall);
          _walls.push(_wall);
        });

        return _walls;
      });

    this.channels$ = this.feedsService
      .getChannelsBySchoolId(1, 1000, search)
      .startWith([{ label: this.cpI18n.translate('all') }])
      .map((channels) => {
        const _channels = [
          {
            label: this.cpI18n.translate('all'),
            action: null,
          },
        ];

        channels.forEach((channel) => {
          const _channel = {
            label: channel.name,
            action: channel.id,
          };

          _channels.push(_channel);
        });

        return _channels;
      });
  }

  onFlaggedOrRemoved(action) {
    switch (action) {
      case 1:
        this.state = Object.assign({}, this.state, {
          flagged_by_users_only: 1,
          removed_by_moderators_only: null,
        });
        break;

      case 2:
        this.state = Object.assign({}, this.state, {
          flagged_by_users_only: null,
          removed_by_moderators_only: 1,
        });
        break;

      default:
        this.state = Object.assign({}, this.state, {
          flagged_by_users_only: null,
          removed_by_moderators_only: null,
        });
    }
    this.doFilter.emit(this.state);
  }

  getWallSettings(id: number) {
    return this.socialGroups.filter((group) => group.action === id)[0];
  }

  updateGroup(group, wall) {
    return Object.assign({}, group, {
      commentingMemberType: wall.min_commenting_member_type,
      postingMemberType: wall.min_posting_member_type,
    });
  }

  onUpdateWallSettings(wall) {
    this.socialGroups = this.socialGroups.map((group) => {
      return group.action === wall.id ? this.updateGroup(group, wall) : group;
    });

    if (this.state.currentView.action === wall.id) {
      this.state = Object.assign({}, this.state, {
        currentView: this.getWallSettings(wall.id),
      });

      this.doFilter.emit(this.state);
    }
  }

  onFilterSelected(item, type) {
    this.state = Object.assign({}, this.state, {
      currentView:
        item.action === 1 ? campusWall : this.getWallSettings(item.action),
    });

    this.state = Object.assign({}, this.state, {
      group_id: item.group_id ? item.group_id : null,
    });
    this.updateState(type, item.action);
  }

  updateState(key: string, value: any) {
    this.state = Object.assign({}, this.state, { [key]: value });
    this.doFilter.emit(this.state);
  }

  ngOnInit() {
    this.posts = [
      {
        label: this.cpI18n.translate('feeds_all_posts'),
        action: null,
      },
      {
        label: this.cpI18n.translate('feeds_flagged_posts'),
        action: 1,
      },
      {
        label: this.cpI18n.translate('feeds_removed_posts'),
        action: 2,
      },
    ];

    if (this.clubId) {
      const search = new URLSearchParams();
      search.append('school_id', this.session.g.get('school').id.toString());
      search.append('store_id', this.clubId.toString());

      const getGroup = this.feedsService.getSocialGroups(search).toPromise();

      getGroup.then((groups) => {
        const group = groups[0];
        this.state = Object.assign({}, this.state, {
          wall_type: group.id,
          group_id: this.clubId,
          flagged_by_users_only: null,
          removed_by_moderators_only: null,
          postingMemberType: group.min_posting_member_type,
          commentingMemberType: group.min_commenting_member_type,
        });

        this.doFilter.emit(this.state);
      });

      return;
    }

    this.fetch();
    this.doFilter.emit(this.state);
  }
}
