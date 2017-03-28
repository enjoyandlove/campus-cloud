import { Component, OnInit, Input } from '@angular/core';

import { FeedsService } from '../../../feeds.service';
import { BaseComponent } from '../../../../../../../base/base.component';

@Component({
  selector: 'cp-feed-comments',
  templateUrl: './feed-comments.component.html',
  styleUrls: ['./feed-comments.component.scss']
})
export class FeedCommentsComponent extends BaseComponent implements OnInit {
  @Input() feedId: number;

  loading;
  comments;

  constructor(
    private feedsService: FeedsService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    super
      .fetchData(this.feedsService.getCommentsByFeedId(this.feedId))
      .then(res => this.comments = res.data)
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
