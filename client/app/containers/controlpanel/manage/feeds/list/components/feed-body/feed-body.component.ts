import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FeedsUtilsService } from '../../../feeds.utils.service';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services/index';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-feed-body',
  templateUrl: './feed-body.component.html',
  styleUrls: ['./feed-body.component.scss']
})
export class FeedBodyComponent implements OnInit {
  @Input() feed: any;
  @Input() clubId: number;
  @Input() replyView: number;
  @Input() athleticId: number;
  @Input() orientationId: number;
  @Input() isRemovedPosts: boolean;

  @Output() viewComments: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleReplies: EventEmitter<boolean> = new EventEmitter();

  eventProperties = {
    post_id: null,
    likes: null,
    comments: null,
    wall_source: null,
    upload_image: null
  };

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public cpTracking: CPTrackingService
    ) {}

  trackEvent(isCommentsOpen) {
    if (isCommentsOpen) {
      this.eventProperties = {
        ...this.eventProperties,
        post_id: this.feed.id,
        likes: this.utils.hasLikes(this.feed.likes),
        upload_image: this.utils.hasImage(this.feed.has_image),
        comments: this.utils.hasComments(this.feed.comment_count),
        wall_source: this.utils.wallSource(this.athleticId, this.orientationId, this.clubId)
      };

      this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_VIEWED_COMMENT, this.eventProperties);
    }
  }

  ngOnInit() {}
}
