import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, startWith, filter } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { get as _get, sortBy } from 'lodash';

import * as fromStore from '../../../store';

import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../../feeds.service';
import { GroupType } from '../../../feeds.utils.service';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives';
import { CPI18nService } from '@campus-cloud/shared/services';
import { amplitudeEvents } from '@campus-cloud/shared/constants';

const campusWall = {
  label: 'Campus Wall',
  action: 1,
  group_id: null,
  commentingMemberType: null,
  postingMemberType: null
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
  is_integrated: boolean;
  store_category_id: number;
  currentView?: ICurrentView;
  flagged_by_users_only: number;
  removed_by_moderators_only: number;
}

const state: IState = {
  wall_type: 1,
  group_id: null,
  post_types: null,
  is_integrated: false,
  currentView: campusWall,
  store_category_id: null,
  flagged_by_users_only: null,
  removed_by_moderators_only: null
};

@Component({
  selector: 'cp-feed-filters',
  templateUrl: './feed-filters.component.html',
  styleUrls: ['./feed-filters.component.scss']
})
export class FeedFiltersComponent implements OnInit {
  @Input() groupId: number;
  @Input() selectedItem: any;
  @Input() groupType: GroupType;
  @Input() hideIntegrations: boolean;
  @Input() isCampusWallView: Observable<any>;

  @Output() doFilter: EventEmitter<IState> = new EventEmitter();

  posts;
  channels;
  channels$;
  eventData;
  state: IState;
  campusWallView;
  socialGroups = [];
  selectedPostType$;
  walls$: Observable<any>;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private feedsService: FeedsService,
    private store: Store<fromStore.IWallsState>
  ) {
    this.state = state;
  }

  private fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.walls$ = this.feedsService.getSocialGroups(search).pipe(
      startWith([
        {
          label: this.cpI18n.translate('campus_wall'),
          action: 1
        }
      ]),
      map((groupWalls: any) => {
        const _walls = [
          {
            label: this.cpI18n.translate('campus_wall'),
            action: 1
          }
        ];

        const alphabeticallySortedWalls = sortBy(groupWalls, (wall: any) => wall.name);

        alphabeticallySortedWalls.forEach((wall: any) => {
          const _wall = {
            label: wall.name,
            action: wall.id,
            store_category_id: wall.store_category_id,
            commentingMemberType: wall.min_commenting_member_type,
            postingMemberType: wall.min_posting_member_type,
            group_id: wall.related_obj_id
          };

          this.socialGroups.push(_wall);

          _walls.push(_wall);
        });

        return _walls;
      })
    );

    this.channels$ = this.feedsService.getChannelsBySchoolId(1, 1000, search).pipe(
      startWith([{ label: this.cpI18n.translate('all') }]),
      map((channels: any) => {
        const _channels = [
          {
            label: this.cpI18n.translate('all'),
            action: null
          }
        ];

        channels.forEach((channel: any) => {
          const _channel = {
            label: channel.name,
            action: channel.id,
            is_integrated: channel.is_integrated
          };

          _channels.push(_channel);
        });

        return _channels;
      })
    );

    const selectedPostType$ = this.store
      .pipe(select(fromStore.getViewFilters))
      .pipe(map(({ postType }) => postType));

    this.selectedPostType$ = combineLatest([this.channels$, selectedPostType$]).pipe(
      filter(([_, selectedPostType]) => !!selectedPostType),
      map(([channels, selectedPostType]) => {
        return (channels as any[]).find((c) => c.action === selectedPostType);
      })
    );
  }

  onFlaggedOrRemoved(action) {
    switch (action) {
      case 1:
        this.state = Object.assign({}, this.state, {
          flagged_by_users_only: 1,
          removed_by_moderators_only: null
        });
        break;

      case 2:
        this.state = Object.assign({}, this.state, {
          flagged_by_users_only: null,
          removed_by_moderators_only: 1
        });
        break;

      default:
        this.state = Object.assign({}, this.state, {
          flagged_by_users_only: null,
          removed_by_moderators_only: null
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
      postingMemberType: wall.min_posting_member_type
    });
  }

  onUpdateWallSettings(wall) {
    this.socialGroups = this.socialGroups.map((group) => {
      return group.action === wall.id ? this.updateGroup(group, wall) : group;
    });

    const action = _get(this.state.currentView, 'action', null);

    if (action === wall.id) {
      this.state = {
        ...this.state,
        currentView: this.getWallSettings(wall.id)
      };

      this.doFilter.emit(this.state);
    }
  }

  onFilterSelected(item, type) {
    const is_integrated = item.is_integrated;
    const store_category_id = item.store_category_id;
    const group_id = item.group_id ? item.group_id : null;
    const currentView = item.action === 1 ? campusWall : this.getWallSettings(item.action);

    this.state = {
      ...this.state,
      group_id,
      currentView,
      is_integrated,
      store_category_id
    };

    this.updateState(type, item.action);
  }

  updateState(key: string, value: any) {
    this.state = Object.assign({}, this.state, { [key]: value });
    this.doFilter.emit(this.state);
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.MANAGE_VIEWED_FEED_INTEGRATION,
      eventProperties: { sub_menu_name: amplitudeEvents.WALL }
    };

    this.posts = [
      {
        label: this.cpI18n.translate('feeds_all_posts'),
        action: null
      },
      {
        label: this.cpI18n.translate('feeds_flagged_posts'),
        action: 1
      },
      {
        label: this.cpI18n.translate('feeds_removed_posts'),
        action: 2
      }
    ];

    if (this.groupId) {
      const group_id = this.groupId;
      const search = new HttpParams()
        .append('school_id', this.session.g.get('school').id.toString())
        .append(
          this.groupType === GroupType.orientation ? 'calendar_id' : 'store_id',
          this.groupId.toString()
        );

      const getGroup = this.feedsService.getSocialGroups(search).toPromise();

      getGroup.then((groups: any) => {
        if (groups.length === 0) {
          return;
        }

        const group = groups[0];
        this.state = Object.assign({}, this.state, {
          wall_type: group.id,
          group_id: group_id,
          flagged_by_users_only: null,
          removed_by_moderators_only: null,
          postingMemberType: group.min_posting_member_type,
          commentingMemberType: group.min_commenting_member_type
        });

        this.doFilter.emit(this.state);
      });

      return;
    }

    this.fetch();
    this.doFilter.emit(this.state);
    this.campusWallView = this.groupType === GroupType.campus;
  }
}
