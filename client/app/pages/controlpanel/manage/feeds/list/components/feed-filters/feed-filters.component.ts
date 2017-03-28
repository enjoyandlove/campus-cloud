import { Component, OnInit, Output, EventEmitter } from '@angular/core';

interface IState {
  wall: number;
  channel: number;
  type: number;
}

const state: IState = {
  wall: null,
  channel: null,
  type: null
};

@Component({
  selector: 'cp-feed-filters',
  templateUrl: './feed-filters.component.html',
  styleUrls: ['./feed-filters.component.scss']
})
export class FeedFiltersComponent implements OnInit {
  @Output() doFilter: EventEmitter<IState> = new EventEmitter();
  walls;
  posts;
  channels;
  state: IState;

  constructor() {
    this.state = state;
  }

  private fetch() {
    this.channels = [
      {
        label: 'All Channels',
        action: null
      },
      {
        label: 'Student Feed',
        action: 12
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
      },
      {
        label: 'Removed Posts',
        action: 2
      }
    ];

    this.doFilter.emit(this.state);
  }

  onFilterSelected(item, type) {
    this.updateState(type, item.action);
  }

  updateState(key: string, value: any) {
    this.state = Object.assign({}, this.state, { [key]: value });
    this.doFilter.emit(this.state);
  }

  ngOnInit() {
    this.fetch();
  }
}
