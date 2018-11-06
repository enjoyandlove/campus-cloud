import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { FeedsUtilsService } from '../../../feeds.utils.service';
import { CPHostDirective } from '../../../../../../../shared/directives';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

@Component({
  selector: 'cp-feed-body',
  templateUrl: './feed-body.component.html',
  styleUrls: ['./feed-body.component.scss']
})
export class FeedBodyComponent implements OnInit {
  @Input() feed: any;
  @Input() clubId: number;
  @Input() replyView: number;
  @Input() isComment: boolean;
  @Input() athleticId: number;
  @Input() wallCategory: string;
  @Input() orientationId: number;
  @Input() isRemovedPosts: boolean;

  @Output() viewComments: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleReplies: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(CPHostDirective) cpHost: CPHostDirective;

  eventProperties = {
    post_id: null,
    likes: null,
    comments: null,
    wall_page: null,
    upload_image: null,
    campus_wall_category: null
  };

  viewImageEventData;

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public cpTracking: CPTrackingService
  ) {}

  trackEvent(isCommentsOpen) {
    if (isCommentsOpen) {
      const campus_wall_category = this.feed.channelName ? this.feed.channelName : null;

      this.eventProperties = {
        ...this.eventProperties,
        campus_wall_category,
        post_id: this.feed.id,
        likes: this.utils.hasLikes(this.feed.likes),
        upload_image: this.utils.hasImage(this.feed.has_image),
        comments: this.utils.hasComments(this.feed.comment_count),
        wall_page: this.utils.wallPage(this.athleticId, this.orientationId, this.clubId)
      };

      this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_VIEWED_COMMENT, this.eventProperties);
    }
  }

  mapImages(feedImages): string[] {
    return feedImages.map((imgObj) => imgObj.url);
  }

  trackViewLightBoxEvent() {
    const campus_wall_category = this.feed.channelName
      ? this.feed.channelName : this.wallCategory ? this.wallCategory : null;

    const message_type = this.isComment ? amplitudeEvents.COMMENT : amplitudeEvents.POST;

    const eventProperties = {
      message_type,
      campus_wall_category,
      likes: this.utils.hasLikes(this.feed.likes),
      wall_page: this.utils.wallPage(this.athleticId, this.orientationId, this.clubId)
    };

    this.viewImageEventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.WALL_CLICKED_IMAGE,
      eventProperties: eventProperties
    };
  }

  ngOnInit() {
    this.trackViewLightBoxEvent();
  }
}
