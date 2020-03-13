import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest, merge } from 'rxjs';
import { takeUntil, map, mapTo, filter, startWith } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { select, Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { FeedsService } from './../../../feeds.service';
import { GroupType } from '../../../feeds.utils.service';
import { FORMAT } from '@campus-cloud/shared/pipes/date';
import * as fromStore from '@controlpanel/manage/feeds/store';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() feedId: number;
  @Input() groupId: number;
  @Input() groupType: GroupType;
  @Input() isCampusWallView: Observable<any>;
  @Input() isFilteredByRemovedPosts: Observable<any>;

  @Output() moved: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() filterByCategory: EventEmitter<any> = new EventEmitter();

  isMoveModal;
  isDeleteModal;
  isApproveModal;
  isRemovedPosts;
  CPDate = CPDate;
  _isCampusWallView;
  FORMAT = FORMAT.SHORT;
  isCommentsOpen = false;
  threadIsExpanded = false;
  matchedComments$: Observable<any[]>;
  isCommentsOpen$: Observable<boolean>;
  loadEmbededPost$: Observable<boolean>;
  loadEmbededPost: Subject<boolean> = new Subject();
  embeddedPost$: Observable<{ loading: boolean; feed: any }>;
  requiresApproval$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  destroy$ = new Subject<null>();
  emitDestroy() {}

  get feedIsAComment() {
    return !!this.feed.campus_thread_id || !!this.feed.group_thread_id;
  }

  constructor(
    private session: CPSession,
    private service: FeedsService,
    private store: Store<fromStore.IWallsState>
  ) {}

  onMoved(movedThread) {
    this.moved.emit(movedThread);
  }

  onSelected(action) {
    switch (action) {
      case 1:
        this.isApproveModal = true;
        setTimeout(
          () => {
            $('#approveFeedModal').modal({ keyboard: true, focus: true });
          },

          1
        );
        break;
      case 2:
        this.isMoveModal = true;
        setTimeout(
          () => {
            $('#moveFeedModal').modal({ keyboard: true, focus: true });
          },

          1
        );
        break;
      case 3:
        this.isDeleteModal = true;
        setTimeout(
          () => {
            $('#deleteFeedModal').modal({ keyboard: true, focus: true });
          },

          1
        );
        break;
    }
  }

  onDeletedComment() {
    const comment_count = this.feed.comment_count === 0 ? 0 : this.feed.comment_count - 1;

    const updatedThread = {
      ...this.feed,
      comment_count
    };
    this.store.dispatch(fromStore.updateThread({ thread: updatedThread }));
  }

  onExpandComments() {
    this.store.dispatch(fromStore.expandComments({ threadId: this.feed.id }));
  }

  onReplied() {
    const updatedThread = {
      ...this.feed,
      comment_count: this.feed.comment_count + 1
    };
    this.store.dispatch(fromStore.updateThread({ thread: updatedThread }));
  }

  onApprovedPost(updatedThread) {
    this.feed = Object.assign({}, this.feed, { flag: 2 });
    this.store.dispatch(fromStore.updateThread({ thread: updatedThread }));
    this.requiresApproval$.next(false);
  }

  parseComment() {
    return FeedsUtilsService.parseComment(this.feed);
  }

  loadPost() {
    this.threadIsExpanded = !this.threadIsExpanded;
    this.loadEmbededPost.next(this.threadIsExpanded);
  }

  ngOnInit() {
    this.isCommentsOpen$ = this.store.pipe(select(fromStore.getExpandedThreadIds)).pipe(
      map((expandedThreadIds) => expandedThreadIds.includes(this.feed.id)),
      startWith(false)
    );
    if (this.feedIsAComment) {
      const loadEmbededPost$ = this.loadEmbededPost
        .asObservable()
        .pipe(filter((loading) => loading));
      const search = new HttpParams().set('school_id', this.session.school.id.toString());
      const embeddedPost$ = this.service.getCampusThreadById(this.feed.campus_thread_id, search);

      const loading$ = merge(loadEmbededPost$, embeddedPost$.pipe(mapTo(false)));

      this.embeddedPost$ = combineLatest([embeddedPost$, loading$]).pipe(
        map(([feed, loading]) => ({ feed, loading }))
      );
    }

    const results$ = this.store.pipe(select(fromStore.getResults));
    const comments$ = this.store.pipe(select(fromStore.getComments));

    this.matchedComments$ = combineLatest([results$, comments$, this.isCommentsOpen$]).pipe(
      map(([results, comments, isCommentsOpen]) => {
        if (isCommentsOpen) {
          return [];
        }
        const matchedThread = results.find((r) => r.id === this.feed.id);

        const matchedCommentIds =
          matchedThread && matchedThread.children ? matchedThread.children : [];

        return comments.filter((c) => matchedCommentIds.includes(c.id));
      })
    );

    this.requiresApproval$.next(this.feed.dislikes > 0 && this.feed.flag !== 2);
    this.isCampusWallView
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this._isCampusWallView = res.type));
    this.isFilteredByRemovedPosts
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.isRemovedPosts = res));
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
