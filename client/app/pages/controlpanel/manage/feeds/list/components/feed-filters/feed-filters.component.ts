import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-feed-filters',
  templateUrl: './feed-filters.component.html',
  styleUrls: ['./feed-filters.component.scss']
})
export class FeedFiltersComponent implements OnInit {
  walls;
  posts;
  channels;

  constructor() { }

  ngOnInit() {
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
  }
}
