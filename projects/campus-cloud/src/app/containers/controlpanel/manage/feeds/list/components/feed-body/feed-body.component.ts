/* tslint:disable:no-host-metadata-property */
import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  OnDestroy,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { of, Observable, Subject, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../store';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService } from '../../../feeds.utils.service';
import { CPHostDirective } from '@campus-cloud/shared/directives';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-body',
  templateUrl: './feed-body.component.html',
  styleUrls: ['./feed-body.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @Output() edited: EventEmitter<any> = new EventEmitter();
  @Output() viewComments: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleReplies: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(CPHostDirective, { static: true }) cpHost: CPHostDirective;

  destroy$ = new Subject<null>();
  editMode$: Observable<boolean>;
  commentCount$: Observable<number>;
  isCommentsOpen$: Observable<boolean>;
  view$: Observable<{
    editMode: boolean;
    commentCount: number;
    isCommentsOpen: boolean;
  }>;

  emitDestroy() {}

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>,
    public feedsAmplitudeService: FeedsAmplitudeService
  ) {}

  ngOnInit() {
    this.editMode$ = this.store.pipe(select(fromStore.getEditing)).pipe(
      map((editing) => editing && editing.id === this.feed.id),
      startWith(false)
    );

    const results$ = this.store.pipe(select(fromStore.getResults));

    this.commentCount$ = this.isComment
      ? of(0)
      : results$.pipe(
          map((results) => {
            const { comment_count, id } = this.feed;
            const matchedPost = results.find((r) => r.type === 'THREAD' && r.id === id);

            return matchedPost && matchedPost.children
              ? comment_count - matchedPost.children.length
              : comment_count;
          }),
          startWith(this.feed.comment_count)
        );

    this.isCommentsOpen$ = this.store
      .pipe(select(fromStore.getExpandedThreadIds))
      .pipe(map((expandedThreadIds) => expandedThreadIds.includes(this.feed.id)));

    this.view$ = combineLatest([this.editMode$, this.commentCount$, this.isCommentsOpen$]).pipe(
      distinctUntilChanged(),
      map(([editMode, commentCount, isCommentsOpen]) => ({
        editMode,
        commentCount,
        isCommentsOpen
      }))
    );
  }

  ngOnDestroy() {
    this.emitDestroy();
  }

  trackEvent(isCommentsOpen) {
    if (isCommentsOpen) {
      const amplitude = this.feedsAmplitudeService.getWallCommonAmplitudeProperties(this.feed);

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

  trackViewLightBoxEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.COMMUNITY_VIEWED_IMAGE,
      this.feedsAmplitudeService.getWallViewedImageAmplitude(this.feed, this.isComment)
    );
  }
}
