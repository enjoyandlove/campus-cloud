import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { FeedsService } from '../../../feeds.service';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-feed-approve-modal',
  templateUrl: './feed-approve-modal.component.html',
  styleUrls: ['./feed-approve-modal.component.scss']
})
export class FeedApproveModalComponent implements OnInit {
  @Input() feed: any;
  @Input() clubId: any;
  @Input() athleticId: any;
  @Input() orientationId: any;
  @Input() isCampusWallView: Observable<number>;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() approved: EventEmitter<number> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  eventProperties = {
    post_id: null,
    likes: null,
    comments: null,
    wall_page: null,
    wall_source: null,
    upload_image: null,
    campus_wall_category: null
  };

  constructor(
    private cpI18n: CPI18nService,
    private utils: FeedsUtilsService,
    private feedsService: FeedsService,
    private cpTracking: CPTrackingService
  ) {}

  onSubmit() {
    const data = { flag: 2 };

    const approveCampusWallThread$ = this.feedsService.approveCampusWallThread(this.feed.id, data);

    const approveGroupWallThread$ = this.feedsService.approveGroupWallThread(this.feed.id, data);

    const stream$ = this._isCampusWallView ? approveCampusWallThread$ : approveGroupWallThread$;

    stream$.subscribe((_) => {
      this.trackAmplitudeEvent(this.feed);
      $('#approveFeedModal').modal('hide');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: true });
      this.approved.emit(this.feed.id);
      this.teardown.emit();
    });
  }

  trackAmplitudeEvent(feed) {
    const campus_wall_category = feed.channelName ? feed.channelName : null;

    const wall_source = this._isCampusWallView
      ? amplitudeEvents.CAMPUS_WALL
      : amplitudeEvents.OTHER_WALLS;

    this.eventProperties = {
      ...this.eventProperties,
      wall_source,
      post_id: feed.id,
      campus_wall_category,
      likes: this.utils.hasLikes(feed.likes),
      upload_image: this.utils.hasImage(feed.has_image),
      comments: this.utils.hasComments(feed.comment_count),
      wall_page: this.utils.wallPage(this.athleticId, this.orientationId, this.clubId)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_APPROVED_POST, this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('approve'),
      class: 'primary'
    };

    this.isCampusWallView.subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }
}
