import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';

import { FeedsService } from '../../../feeds.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { ICampusThread, ISocialGroupThread } from '@controlpanel/manage/feeds/model';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-approve-modal',
  templateUrl: './feed-approve-modal.component.html',
  styleUrls: ['./feed-approve-modal.component.scss']
})
export class FeedApproveModalComponent implements OnInit, OnDestroy {
  @Input() feed: ICampusThread;
  @Input() isCampusWallView: Observable<{}>;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() approved: EventEmitter<ICampusThread | ISocialGroupThread> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private cpI18n: CPI18nService,
    private utils: FeedsUtilsService,
    public feedsService: FeedsService,
    private cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>,
    public feedsAmplitudeService: FeedsAmplitudeService
  ) {}

  onSubmit() {
    const data = { flag: 2 };

    const approveCampusWallThread$ = this.feedsService.approveCampusWallThread(
      this.feed.id,
      data
    ) as Observable<ICampusThread>;

    const approveGroupWallThread$ = this.feedsService.approveGroupWallThread(
      this.feed.id,
      data
    ) as Observable<ISocialGroupThread>;

    const stream$: Observable<ICampusThread | ISocialGroupThread> = this._isCampusWallView
      ? approveCampusWallThread$
      : approveGroupWallThread$;

    stream$.subscribe((approvedThread) => {
      this.trackAmplitudeEvent(this.feed);
      $('#approveFeedModal').modal('hide');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: true });
      this.store.dispatch(fromStore.updateThread({ thread: approvedThread }));
      this.approved.emit(approvedThread);
      this.teardown.emit();
    });
  }

  trackAmplitudeEvent(feed) {
    const amplitude = this.feedsAmplitudeService.getWallCommonAmplitudeProperties(feed);

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_APPROVED_POST, amplitude);
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
