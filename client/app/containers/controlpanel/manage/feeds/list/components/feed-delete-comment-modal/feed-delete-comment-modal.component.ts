import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { FeedsService } from '../../../feeds.service';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services/index';

declare var $: any;

@Component({
  selector: 'cp-feed-delete-comment-modal',
  templateUrl: './feed-delete-comment-modal.component.html',
  styleUrls: ['./feed-delete-comment-modal.component.scss']
})
export class FeedDeleteCommentModalComponent implements OnInit {
  @Input() feed: any;
  @Input() clubId: number;
  @Input() athleticId: number;
  @Input() orientationId: number;
  @Input() isCampusWallView: Observable<number>;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  eventProperties = {
    comment_id: null,
    likes: null,
    wall_source: null,
    upload_image: null
  };

  constructor(
    private cpI18n: CPI18nService,
    private utils: FeedsUtilsService,
    private feedsService: FeedsService,
    private cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const deleteCampusComment$ = this.feedsService.deleteCampusWallCommentByThreadId(this.feed.id);
    const deleteGroupComment$ = this.feedsService.deleteGroupWallCommentByThreadId(this.feed.id);
    const stream$ = this._isCampusWallView ? deleteCampusComment$ : deleteGroupComment$;

    stream$.subscribe((_) => {
      this.trackAmplitudeEvent(this.feed);
      $('#deleteFeedCommentModal').modal('hide');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.deleted.emit(this.feed.id);
      this.teardown.emit();
    });
  }

  trackAmplitudeEvent(comment) {
    this.eventProperties = {
      ...this.eventProperties,
      comment_id: comment.id,
      likes: this.utils.hasLikes(comment.likes),
      upload_image: this.utils.hasImage(comment.has_image),
      wall_source: this.utils.wallSource(this.athleticId, this.orientationId, this.clubId)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_DELETED_COMMENT, this.eventProperties);
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
