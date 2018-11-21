import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { FeedsService } from '../../../feeds.service';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services/index';

declare var $: any;

@Component({
  selector: 'cp-feed-delete-modal',
  templateUrl: './feed-delete-modal.component.html',
  styleUrls: ['./feed-delete-modal.component.scss']
})
export class FeedDeleteModalComponent implements OnInit {
  @Input() feed: any;
  @Input() groupType: GroupType;
  @Input() isCampusWallView: Observable<number>;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  eventProperties = {
    post_id: null,
    likes: null,
    comments: null,
    wall_page: null,
    upload_image: null,
    campus_wall_category: null
  };

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public feedsService: FeedsService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const deleteCampusThread$ = this.feedsService.deleteCampusWallMessageByThreadId(this.feed.id);
    const deleteGroupThread$ = this.feedsService.deleteGroupWallMessageByThreadId(this.feed.id);
    const stream$ = this._isCampusWallView ? deleteCampusThread$ : deleteGroupThread$;

    stream$.subscribe((_) => {
      this.trackAmplitudeEvent(this.feed);
      $('#deleteFeedModal').modal('hide');
      this.deleted.emit(this.feed.id);
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.teardown.emit();
    });
  }

  trackAmplitudeEvent(feed) {
    const campus_wall_category = feed.channelName ? feed.channelName : null;

    this.eventProperties = {
      ...this.eventProperties,
      post_id: feed.id,
      campus_wall_category,
      likes: this.utils.hasLikes(feed.likes),
      upload_image: this.utils.hasImage(feed.has_image),
      comments: this.utils.hasComments(feed.comment_count),
      wall_page: this.utils.wallPage(this.groupType)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_DELETED_POST, this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };

    this.isCampusWallView.subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }
}
