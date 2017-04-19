import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../feeds.service';
import { BaseComponent } from '../../../../../../base/base.component';

interface IState {
  post_types: number;
  flagged_by_users_only: number;
}

const state: IState = {
  post_types: null,
  flagged_by_users_only: null
};

@Component({
  selector: 'cp-feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss']
})
export class FeedsComponent extends BaseComponent implements OnInit {
  feeds;
  loading;
  isSimple;
  state: IState = state;

  constructor(
    public service: FeedsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  onDoFilter(data) {
    this.state = Object.assign(
      {},
      this.state,
      {
        post_types: data.post_types,
        flagged_by_users_only: data.flagged_by_users_only
      }
    );

    this.fetch();
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }


  private fetch() {
    const school_id = '157';
    let search = new URLSearchParams();
    let flagged = this.state.flagged_by_users_only ?
      this.state.flagged_by_users_only.toString() : null;

    let type = this.state.post_types ?
      this.state.post_types.toString() : null;

    search.append('post_types', type);
    search.append('school_id', school_id);
    search.append('flagged_by_users_only', flagged);

    super
      .fetchData(this.service.getFeeds(this.startRange, this.endRange, search))
      .then(res => {
        this.feeds = res.data;
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  ngOnInit() { }
}
