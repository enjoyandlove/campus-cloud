import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';

import { FeedsService } from '../../../feeds.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-delete-comment-modal',
  templateUrl: './feed-delete-comment-modal.component.html',
  styleUrls: ['./feed-delete-comment-modal.component.scss']
})
export class FeedDeleteCommentModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() groupType: GroupType;
  @Input() wallCategory: string;
  @Input() isCampusWallView: Observable<{}>;

  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  eventProperties = {
    likes: null,
    wall_page: null,
    comment_id: null,
    wall_source: null,
    upload_image: null,
    campus_wall_category: null
  };

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private cpI18n: CPI18nService,
    private utils: FeedsUtilsService,
    public feedsService: FeedsService,
    private cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>
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
    const campus_wall_category = this.wallCategory ? this.wallCategory : null;

    const wall_source = this._isCampusWallView
      ? amplitudeEvents.CAMPUS_WALL
      : amplitudeEvents.OTHER_WALLS;

    this.eventProperties = {
      ...this.eventProperties,
      wall_source,
      campus_wall_category,
      comment_id: comment.id,
      likes: this.utils.hasLikes(comment.likes),
      upload_image: this.utils.hasImage(comment.has_image),
      wall_page: this.utils.wallPage(this.groupType)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_DELETED_COMMENT, this.eventProperties);
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
