import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';
import { ISnackbar } from '@campus-cloud/store';
import { baseActionClass } from '@campus-cloud/store';
import { FeedsService } from '../../../feeds.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-delete-modal',
  templateUrl: './feed-delete-modal.component.html',
  styleUrls: ['./feed-delete-modal.component.scss']
})
export class FeedDeleteModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() isCampusWallView: Observable<{}>;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  _isCampusWallView;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public feedsService: FeedsService,
    public cpTracking: CPTrackingService,
    private feedsAmplitudeService: FeedsAmplitudeService,
    private store: Store<fromStore.IWallsState | ISnackbar>
  ) {}

  onClose() {
    $('#deleteFeedModal').modal('hide');
    this.teardown.emit();
  }

  onDelete() {
    const deleteCampusThread$ = this.feedsService.deleteCampusWallMessageByThreadId(this.feed.id);
    const deleteGroupThread$ = this.feedsService.deleteGroupWallMessageByThreadId(this.feed.id);
    const stream$ = this._isCampusWallView ? deleteCampusThread$ : deleteGroupThread$;

    stream$.subscribe(
      () => {
        this.trackAmplitudeEvent(this.feed);
        $('#deleteFeedModal').modal('hide');
        this.deleted.emit(this.feed.id);
        this.store.dispatch(fromStore.removeThread({ threadId: this.feed.id }));
        this.teardown.emit();
      },
      () => this.handleError()
    );
  }

  handleError() {
    this.onClose();
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  trackAmplitudeEvent(feed) {
    const amplitude = this.feedsAmplitudeService.getWallCommonAmplitudeProperties(feed);
    delete amplitude['post_type'];

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_DELETED_POST, amplitude);
  }

  ngOnInit() {
    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
