import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../feeds.service';
import { BaseComponent } from '../../../../../../base/base.component';

@Component({
  selector: 'cp-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent extends BaseComponent implements OnInit {
  feeds;
  loading;
  isSimple;

  constructor(
    public service: FeedsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onDoFilter() {
    this.fetch();
  }

  private fetch() {
    const school_id = '157';
    let search = new URLSearchParams();
    search.append('school_id', school_id);

    super
      .fetchData(this.service.getFeeds( search ))
      .then(res => this.feeds = res.data)
      .catch(err => console.log(err));
  }

  ngOnInit() { }
}
