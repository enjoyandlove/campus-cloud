import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FeedsService } from '../../../feeds.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-approve-modal',
  templateUrl: './feed-approve-modal.component.html',
  styleUrls: ['./feed-approve-modal.component.scss']
})
export class FeedApproveModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() groupType: GroupType;
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

  destroy$ = new Subject<null>();
  emitDestroy() {}

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
      wall_page: this.utils.wallPage(this.groupType)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_APPROVED_POST, this.eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('approve'),
      class: 'primary'
    };

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
