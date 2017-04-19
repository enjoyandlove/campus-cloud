import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../../feeds.service';
import { BaseComponent } from '../../../../../../../base/base.component';

interface IState {
  post_types: number;
  flagged_by_users_only: number;
}

const state: IState = {
  post_types: null,
  flagged_by_users_only: null
};

@Component({
  selector: 'cp-feed-filters',
  templateUrl: './feed-filters.component.html',
  styleUrls: ['./feed-filters.component.scss']
})
export class FeedFiltersComponent extends BaseComponent implements OnInit {
  @Input() isSimple: boolean;
  @Output() doFilter: EventEmitter<IState> = new EventEmitter();
  walls;
  posts;
  loading;
  channels;
  state: IState;

  constructor(
    private feedsService: FeedsService,
  ) {
    super();
    this.state = state;
    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
  }

  private fetch() {
    const schoolId = 157;
    let search = new URLSearchParams();
    search.append('school_id', schoolId.toString());

    const stream$ = this.feedsService.getChannelsBySchoolId(1, 100, search)
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

    super
      .fetchData(stream$)
      .then(res => {
        this.channels = res.data;
        this.doFilter.emit(this.state);
      })
      .catch(err => console.log(err));

  }

  onFilterSelected(item, type) {
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
      }
      // {
      //   label: 'Removed Posts',
      //   action: 2
      // }
    ];
  }
}
