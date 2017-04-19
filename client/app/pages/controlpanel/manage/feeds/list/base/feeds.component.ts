import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { FeedsService } from '../../feeds.service';
import { BaseComponent } from '../../../../../../base/base.component';

interface IState {
  feeds: Array<any>;
  post_types: number;
  flagged_by_users_only: number;
}

const state: IState = {
  feeds: [],
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
  school_id = 157;
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
    let search = new URLSearchParams();
    let flagged = this.state.flagged_by_users_only ?
      this.state.flagged_by_users_only.toString() : null;

    let type = this.state.post_types ?
      this.state.post_types.toString() : null;

    search.append('post_types', type);
    search.append('school_id', this.school_id.toString());
    search.append('flagged_by_users_only', flagged);

    super
      .fetchData(this.service.getFeeds(this.startRange, this.endRange, search))
      .then(res => {
        this.state = Object.assign({}, this.state, { feeds: res.data });
      })
      .catch(err => console.log(err));
  }

  onCreated(feed) {
    this.state = Object.assign(
      {},
      this.state,
      { feeds: [feed, ...this.state.feeds] }
    );
  }

  onEdited(feed) {
    let _state = Object.assign({}, this.state, {
      feeds: this.state.feeds.map(_feed => {
        if (_feed.id === feed.id) {
          return _feed = feed;
        }
        return _feed;
      })
    });

    this.state = Object.assign({}, this.state, _state);
  }

  onDeleted(feedId: number) {
    let _state = Object.assign({}, this.state);

    _state.feeds = _state.feeds.filter(feed => feed.id !== feedId);

    this.state = Object.assign({}, this.state, { feeds: _state.feeds });
  }

  ngOnInit() { }
}
