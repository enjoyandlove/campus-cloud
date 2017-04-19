import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

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
    let search = new URLSearchParams();
    search.append('school_id', '157');
    search.append('thread_id', this.feedId.toString());

    super
      .fetchData(this.feedsService.getCommentsByFeedId(search))
      .then(res => {
        console.log(res);
        let _comments = [];

        res.data.map(comment => {
          _comments.push({
            id: comment.id,
            avatar_thumb: comment.avatar_thumb,
            image_thumb_url: comment.image_thumb_url,
            message: comment.comment,
            likes: comment.likes,
            flag: comment.flag,
            display_name: comment.display_name,
            added_time: comment.added_time
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
