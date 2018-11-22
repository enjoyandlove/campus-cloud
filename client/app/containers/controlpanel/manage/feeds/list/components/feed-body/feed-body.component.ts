import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { CPHostDirective } from '../../../../../../../shared/directives';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-feed-body',
  templateUrl: './feed-body.component.html',
  styleUrls: ['./feed-body.component.scss']
})
export class FeedBodyComponent implements OnInit {
  @Input() feed: any;
  @Input() replyView: number;
  @Input() isComment: boolean;
  @Input() wallCategory: string;
  @Input() groupType: GroupType;
  @Input() isRemovedPosts: boolean;
  @Input() isCampusWallView: Observable<number>;

  @Output() viewComments: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleReplies: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(CPHostDirective) cpHost: CPHostDirective;

  eventProperties = {
    post_id: null,
    likes: null,
    comments: null,
    wall_page: null,
    wall_source: null,
    upload_image: null,
    campus_wall_category: null
  };

  _isCampusWallView;
  viewImageEventData;

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public cpTracking: CPTrackingService
  ) {}

  trackEvent(isCommentsOpen) {
    if (isCommentsOpen) {
      const campus_wall_category = this.feed.channelName ? this.feed.channelName : null;
      const wall_source = this._isCampusWallView
        ? amplitudeEvents.CAMPUS_WALL
        : amplitudeEvents.OTHER_WALLS;

      this.eventProperties = {
        ...this.eventProperties,
        wall_source,
        campus_wall_category,
        post_id: this.feed.id,
        likes: this.utils.hasLikes(this.feed.likes),
        upload_image: this.utils.hasImage(this.feed.has_image),
        comments: this.utils.hasComments(this.feed.comment_count),
        wall_page: this.utils.wallPage(this.groupType)
      };

      this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_VIEWED_COMMENT, this.eventProperties);
    }
  }

  mapImages(feedImages): string[] {
    return feedImages.map((imgObj) => imgObj.url);
  }

  trackViewLightBoxEvent() {
    const wallCategory = this.wallCategory ? this.wallCategory : null;
    const channelName = this.feed.channelName ? this.feed.channelName : null;
    const campus_wall_category = channelName ? channelName : wallCategory;

    const message_type = this.isComment ? amplitudeEvents.COMMENT : amplitudeEvents.POST;

    const wall_source = this._isCampusWallView
      ? amplitudeEvents.CAMPUS_WALL
      : amplitudeEvents.OTHER_WALLS;

    const eventProperties = {
      message_type,
      wall_source,
      campus_wall_category,
      likes: this.utils.hasLikes(this.feed.likes),
      wall_page: this.utils.wallPage(this.groupType)
    };

    this.viewImageEventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.WALL_CLICKED_IMAGE,
      eventProperties: eventProperties
    };
  }

  ngOnInit() {
    this.trackViewLightBoxEvent();

    this.isCampusWallView.subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }
}
