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
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { CP_TRACK_TO, CPHostDirective } from '@campus-cloud/shared/directives';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

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
  @Input() groupType: GroupType;
  @Input() isRemovedPosts: boolean;
  @Input() isCampusWallView: Observable<{}>;

  @Output() viewComments: EventEmitter<boolean> = new EventEmitter();
  @Output() toggleReplies: EventEmitter<boolean> = new EventEmitter();

  @ViewChild(CPHostDirective, { static: true }) cpHost: CPHostDirective;

  commentCount$: Observable<number>;
  isCommentsOpen$: Observable<boolean>;

  eventProperties = {
    post_id: null,
    likes: null,
    comments: null,
    wall_page: null,
    wall_source: null,
    upload_image: null,
    campus_wall_category: null
  };

  _isCampusWallView;
  viewImageEventData;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    public cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>
  ) {}

  onToggleComments() {
    this.store.dispatch(fromStore.expandComments({ threadId: this.feed.id }));
  }

  trackEvent(isCommentsOpen) {
    if (isCommentsOpen) {
      const campus_wall_category = this.feed.channelName ? this.feed.channelName : null;
      const wall_source = this._isCampusWallView
        ? amplitudeEvents.CAMPUS_WALL
        : amplitudeEvents.OTHER_WALLS;

      this.eventProperties = {
        ...this.eventProperties,
        wall_source,
        campus_wall_category,
        post_id: this.feed.id,
        likes: this.utils.hasLikes(this.feed.likes),
        upload_image: this.utils.hasImage(this.feed.has_image),
        comments: this.utils.hasComments(this.feed.comment_count),
        wall_page: this.utils.wallPage(this.groupType)
      };

      this.cpTracking.amplitudeEmitEvent(amplitudeEvents.WALL_VIEWED_COMMENT, this.eventProperties);
    }
  }

  mapImages(feedImages): string[] {
    return feedImages.map((imgObj) => imgObj.url);
  }

  trackViewLightBoxEvent() {
    const wallCategory = this.wallCategory ? this.wallCategory : null;
    const channelName = this.feed.channelName ? this.feed.channelName : null;
    const campus_wall_category = channelName ? channelName : wallCategory;

    const message_type = this.isComment ? amplitudeEvents.COMMENT : amplitudeEvents.POST;

    const wall_source = this._isCampusWallView
      ? amplitudeEvents.CAMPUS_WALL
      : amplitudeEvents.OTHER_WALLS;

    const eventProperties = {
      message_type,
      wall_source,
      campus_wall_category,
      likes: this.utils.hasLikes(this.feed.likes),
      wall_page: this.utils.wallPage(this.groupType)
    };

    this.viewImageEventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.WALL_CLICKED_IMAGE,
      eventProperties: eventProperties
    };
  }

  ngOnInit() {
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

    this.trackViewLightBoxEvent();

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
