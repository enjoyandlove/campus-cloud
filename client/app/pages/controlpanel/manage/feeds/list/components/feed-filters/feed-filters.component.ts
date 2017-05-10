import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../../feeds.service';
import { CPSession } from '../../../../../../../session';

interface IState {
  wall_type: number;
  post_types: number;
  group_id: number;
  flagged_by_users_only: number;
}

const state: IState = {
  wall_type: 1,
  group_id: null,
  post_types: null,
  flagged_by_users_only: null
};

@Component({
  selector: 'cp-feed-filters',
  templateUrl: './feed-filters.component.html',
  styleUrls: ['./feed-filters.component.scss']
})
export class FeedFiltersComponent implements OnInit {
  @Input() isSimple: boolean;
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
    this.fetch();
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
      .map(walls => {
        let _walls = [
          {
            label: 'Campus Wall',
            action: 1
          }
        ];

        walls.forEach(wall => {
          let _wall = {
            label: wall.name,
            action: wall.id,
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

  onFilterSelected(item, type) {
    this.state = Object.assign(
      {},
      this.state,
      { group_id: item.group_id ? item.group_id : null }
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

    this.doFilter.emit(this.state);
  }
}
