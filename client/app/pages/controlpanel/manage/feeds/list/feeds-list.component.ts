import { Component, OnInit } from '@angular/core';

import { FeedsService } from '../feeds.service';
import { BaseComponent } from '../../../../../base/base.component';

@Component({
  selector: 'cp-feeds-list',
  templateUrl: './feeds-list.component.html',
  styleUrls: ['./feeds-list.component.scss']
})
export class FeedsListComponent extends BaseComponent implements OnInit {
  feeds;
  loading;

  constructor(
    private feedsService: FeedsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onDoFilter() {
    this.fetch();
  }

  private fetch() {
    super
      .fetchData(this.feedsService.getFeeds())
      .then(res => {
        this.feeds = res.data;
      })
      .catch(
        err => console.log(err)
      );
  }

  ngOnInit() { }
}
