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
      .then(res => {
        let _comments = [];

        res.data.map(comment => {
          _comments.push({
            id: comment.id,
            message_has_image: comment.comment_has_image,
            message_image_url: comment.comment_image_url,
            message: comment.comment,
            likes: comment.likes,
            flag: comment.flag,
            display_name: comment.display_name,
            added_time_epoch: comment.added_time_epoch
          });
        });

        this.comments = _comments;
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
