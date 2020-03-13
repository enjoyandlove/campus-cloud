import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';

import { FeedsService } from '../../../feeds.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService } from '../../../feeds.utils.service';
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
    private feedsAmplitudeService: FeedsAmplitudeService
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
      this.store.dispatch(fromStore.removeComment({ commentId: this.feed.id }));
      this.teardown.emit();
    });
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

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_DELETED_COMMENT, amplitude);
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete')
    };

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
