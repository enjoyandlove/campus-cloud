import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../../feeds.service';

interface IState {
  wall: number;
  post_types: number;
  flagged_by_users_only: number;
}

const state: IState = {
  wall: null,
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

  walls;
  posts;
  channels;
  channels$;
  state: IState;

  constructor(
    private feedsService: FeedsService,
  ) {
    this.state = state;
    this.fetch();
  }

  private fetch() {
    const schoolId = 157;
    let search = new URLSearchParams();
    search.append('school_id', schoolId.toString());

    this.channels$ = this.feedsService.getChannelsBySchoolId(1, 100, search)
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
    this.updateState(type, item.action);
  }

  updateState(key: string, value: any) {
    this.state = Object.assign({}, this.state, { [key]: value });
    this.doFilter.emit(this.state);
  }

  ngOnInit() {
    this.walls = [
      {
        label: 'All',
        action: null
      },
      {
        label: 'Campus Wall',
        action: 1
      },
      {
        label: 'Club Wall',
        action: 2
      }
    ];

    this.posts = [
      {
        label: 'All Posts',
        action: null
      },
      {
        label: 'Flagged Posts',
        action: 1
      }
      // {
      //   label: 'Removed Posts',
      //   action: 2
      // }
    ];

    this.doFilter.emit(this.state);
  }
}
