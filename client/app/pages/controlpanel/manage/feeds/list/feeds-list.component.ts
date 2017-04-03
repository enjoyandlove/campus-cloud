import { Component, OnInit } from '@angular/core';

import { FeedsComponent } from './base';
import { FeedsService } from '../feeds.service';

@Component({
  selector: 'cp-feeds-list',
  templateUrl: './base/feeds.component.html',
  styleUrls: ['./base/feeds.component.scss']
})
export class FeedsListComponent extends FeedsComponent implements OnInit {
  feeds;
  loading;

  constructor(
    public service: FeedsService
  ) {
    super(service.getFeeds());
    super.isLoading().subscribe(res => this.loading = res);
  }

  ngOnInit() { }
}
