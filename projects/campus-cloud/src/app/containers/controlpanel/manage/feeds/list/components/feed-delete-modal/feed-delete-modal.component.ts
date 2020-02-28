import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';

import { FeedsService } from '../../../feeds.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-delete-modal',
  templateUrl: './feed-delete-modal.component.html',
  styleUrls: ['./feed-delete-modal.component.scss']
})
export class FeedDeleteModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() groupType: GroupType;
  @Input() isCampusWallView: Observable<{}>;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

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
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public feedsService: FeedsService,
    public cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>
  ) {}

  onDelete() {
    const deleteCampusThread$ = this.feedsService.deleteCampusWallMessageByThreadId(this.feed.id);
    const deleteGroupThread$ = this.feedsService.deleteGroupWallMessageByThreadId(this.feed.id);
    const stream$ = this._isCampusWallView ? deleteCampusThread$ : deleteGroupThread$;

    stream$.subscribe((_) => {
      this.trackAmplitudeEvent(this.feed);
      $('#deleteFeedModal').modal('hide');
      this.deleted.emit(this.feed.id);
      this.store.dispatch(fromStore.removeThread({ threadId: this.feed.id }));
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.teardown.emit();
    });
  }

  trackAmplitudeEvent(feed) {
    const wall_source = this._isCampusWallView
      ? amplitudeEvents.CAMPUS_WALL
      : amplitudeEvents.OTHER_WALLS;

    const campus_wall_category = feed.channelName ? feed.channelName : null;

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

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_DELETED_POST, this.eventProperties);
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
