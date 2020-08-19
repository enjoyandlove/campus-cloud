import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';
import { ISnackbar } from '@campus-cloud/store';
import { baseActionClass } from '@campus-cloud/store';
import { FeedsService } from '../../../feeds.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-delete-comment-modal',
  templateUrl: './feed-delete-comment-modal.component.html',
  styleUrls: ['./feed-delete-comment-modal.component.scss']
})
export class FeedDeleteCommentModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() isCampusWallView: Observable<{}>;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  _isCampusWallView;
  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private cpI18n: CPI18nService,
    public feedsService: FeedsService,
    private cpTracking: CPTrackingService,
    private feedsAmplitudeService: FeedsAmplitudeService,
    private store: Store<fromStore.IWallsState | ISnackbar>
  ) {}

  onClose() {
    $('#deleteFeedModal').modal('hide');
    $('#deleteFeedCommentModal').modal('hide');
    this.teardown.emit();
  }

  onDelete() {
    const deleteCampusComment$ = this.feedsService.deleteCampusWallCommentByThreadId(this.feed.id);
    const deleteGroupComment$ = this.feedsService.deleteGroupWallCommentByThreadId(this.feed.id);
    const stream$ = this._isCampusWallView ? deleteCampusComment$ : deleteGroupComment$;

    stream$.subscribe(
      () => {
        this.trackAmplitudeEvent(this.feed);
        $('#deleteFeedModal').modal('hide');
        $('#deleteFeedCommentModal').modal('hide');
        this.deleted.emit(this.feed.id);
        this.store.dispatch(fromStore.removeComment({ commentId: this.feed.id }));
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

  trackAmplitudeEvent(comment) {
    const {
      likes,
      wall_source,
      upload_image,
      sub_menu_name
    } = this.feedsAmplitudeService.getWallCommonAmplitudeProperties(comment);

    const amplitude = {
      likes,
      wall_source,
      upload_image,
      sub_menu_name,
      comment_id: comment.id
    };

    const wallThreadAmplitude = this.feedsAmplitudeService.getWallThreadAmplitude(
      this.feed,
      'Comment'
    );

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_DELETED_COMMENT, amplitude);
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.COMMUNITY_DELETED_THREAD,
      wallThreadAmplitude
    );
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
