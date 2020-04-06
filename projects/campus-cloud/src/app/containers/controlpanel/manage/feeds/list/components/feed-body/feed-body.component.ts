/* tslint:disable:no-host-metadata-property */
import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  OnDestroy,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../store';

import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { CPHostDirective } from '@campus-cloud/shared/directives';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-body',
  templateUrl: './feed-body.component.html',
  styleUrls: ['./feed-body.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cp-feed-body'
  }
})
export class FeedBodyComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() replyView = false;
  @Input() isComment: boolean;
  @Input() wallCategory: string;
  @Input() isRemovedPosts: boolean;
  @Input() isCampusWallView: Observable<{}>;

  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() viewComments: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleReplies: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(CPHostDirective, { static: true }) cpHost: CPHostDirective;

  _isCampusWallView;
  isCommentsOpen = false;
  destroy$ = new Subject<null>();
  editMode$: Observable<boolean>;
  commentCount$: Observable<number>;
  isCommentsOpen$: Observable<boolean>;

  emitDestroy() {}

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>,
    public feedsAmplitudeService: FeedsAmplitudeService
  ) {}

  onToggleComments() {
    this.store.dispatch(fromStore.expandComments({ threadId: this.feed.id }));
  }

  trackEvent(isCommentsOpen) {
    if (isCommentsOpen) {
      const amplitude = this.feedsAmplitudeService.getWallCommonAmplitudeProperties(this.feed);
      delete amplitude['post_type'];

      this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_VIEWED_COMMENT, amplitude);
    }
  }

  updateHandler(changes) {
    this.feed = {
      ...this.feed,
      ...changes
    };

    this.edited.emit(changes);
  }
  mapImages(feedImages): string[] {
    return feedImages.map((imgObj) => imgObj.url);
  }

  trackViewLightBoxEvent() {
    const message_type = this.isComment ? amplitudeEvents.COMMENT : amplitudeEvents.POST;
    const { wall_source, sub_menu_name } = this.feedsAmplitudeService.getWallAmplitudeProperties();

    const amplitude = {
      wall_source,
      message_type,
      sub_menu_name,
      likes: FeedsAmplitudeService.hasData(this.feed.likes),
      creation_source: this.feedsAmplitudeService.getPostCreationSource(this.feed.post_type)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_CLICKED_IMAGE, amplitude);
  }

  ngOnInit() {
    this.editMode$ = this.store
      .pipe(select(fromStore.getEditing))
      .pipe(map((editing) => editing && editing.id === this.feed.id));

    const results$ = this.store.pipe(select(fromStore.getResults));

    this.commentCount$ = combineLatest([results$]).pipe(
      map(([results]) => {
        const { comment_count, id } = this.feed;
        const matchedPost = results.find((r) => r.type === 'THREAD' && r.id === id);

        return matchedPost && matchedPost.children
          ? comment_count - matchedPost.children.length
          : comment_count;
      })
    );

    this.isCommentsOpen$ = this.store
      .pipe(select(fromStore.getExpandedThreadIds))
      .pipe(map((expandedThreadIds) => expandedThreadIds.includes(this.feed.id)));

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
