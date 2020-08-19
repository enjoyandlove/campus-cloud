import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { distinctUntilChanged, map, mapTo, filter, startWith } from 'rxjs/operators';
import { Observable, Subject, combineLatest, merge, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { baseActionClass } from '@campus-cloud/store/base';
import { FeedsService } from './../../../feeds.service';
import { GroupType } from '../../../feeds.utils.service';
import { FORMAT } from '@campus-cloud/shared/pipes/date';
import { CPI18nService } from '@campus-cloud/shared/services';
import * as fromStore from '@controlpanel/manage/feeds/store';
import { FeedsUtilsService } from '@controlpanel/manage/feeds/feeds.utils.service';
import {
  ICampusThread,
  ISocialGroupThread,
  ICampusThreadComment,
  ISocialGroupThreadComment
} from '@controlpanel/manage/feeds/model';

@Component({
  selector: 'cp-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit {
  @Input() hideDropdown = false;
  @Input() feed: any;
  @Input() mode: 'default' | 'search' | 'inline' = 'default';
  @Input() comment: ICampusThreadComment | ISocialGroupThreadComment;

  @Input() feedId: number;
  @Input() groupId: number;
  @Input() groupType: GroupType;
  @Input() readOnlyMode = false;
  @Input() isCampusWallView: Observable<any>;

  @Output() moved: EventEmitter<any> = new EventEmitter();
  @Output() approved: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() filterByCategory: EventEmitter<any> = new EventEmitter();

  isMoveModal;
  isDeleteModal;
  isApproveModal;
  CPDate = CPDate;
  FORMAT = FORMAT.SHORT;
  isCommentsOpen = false;
  threadIsExpanded = false;
  matchedComments$: Observable<any[]>;
  isCommentsOpen$: Observable<boolean>;
  loadEmbeddedPost: Subject<boolean> = new Subject();
  embeddedPost$: Observable<{ loading: boolean; feed: any }>;
  view$: Observable<{
    commentsOpen: boolean;
    matchedComments: any[];
    deleted: boolean;
  }>;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  get feedIsAComment() {
    if (this.mode === 'default') {
      return !!this.feed.campus_thread_id || !!this.feed.group_thread_id;
    }
    return false;
  }

  filters$ = this.store.select(fromStore.getViewFilters).pipe(distinctUntilChanged());

  constructor(
    private router: Router,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: FeedsService,
    private utils: FeedsUtilsService,
    private store: Store<fromStore.IWallsState>
  ) {}

  onExpandComments() {
    this.store.dispatch(fromStore.expandComments({ threadId: this.feed.id }));
  }

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

  onApprovedPost(updatedThread: ICampusThread) {
    this.store.dispatch(fromStore.updateThread({ thread: updatedThread }));
  }

  onDeletedComment() {
    const comment_count = this.feed.comment_count === 0 ? 0 : this.feed.comment_count - 1;

    const updatedThread = {
      ...this.feed,
      comment_count
    };
    this.store.dispatch(fromStore.updateThread({ thread: updatedThread }));
  }

  onReplied() {
    const updatedThread = {
      ...this.feed,
      comment_count: this.feed.comment_count + 1
    };
    this.store.dispatch(fromStore.updateThread({ thread: updatedThread }));
  }

  ngOnInit() {
    this.isCommentsOpen$ =
      this.mode !== 'default'
        ? of(false)
        : this.store.pipe(select(fromStore.getExpandedThreadIds)).pipe(
            map((expandedThreadIds) => {
              if (this.feed.comment_count === 0 && this.readOnlyMode) {
                return false;
              }

              return expandedThreadIds.includes(this.feed.id);
            }),
            startWith(false)
          );

    if (this.feedIsAComment) {
      const loadEmbeddedPost$ = this.loadEmbeddedPost
        .asObservable()
        .pipe(filter((loading) => loading));
      const search = new HttpParams().set('school_id', this.session.school.id.toString());
      const embeddedPost$ = this.service.getCampusThreadById(this.feed.campus_thread_id, search);
      const loading$ = merge(loadEmbeddedPost$, embeddedPost$.pipe(mapTo(false)));
      this.embeddedPost$ = combineLatest([embeddedPost$, loading$]).pipe(
        map(([feed, loading]) => ({ feed, loading }))
      );
    }

    const results$ = this.store.pipe(select(fromStore.getResults));

    const comments$ = this.store.pipe(select(fromStore.getComments));

    this.matchedComments$ =
      this.mode !== 'default'
        ? of([])
        : combineLatest([results$, comments$, this.isCommentsOpen$]).pipe(
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

    this.view$ = combineLatest([this.isCommentsOpen$, this.matchedComments$, this.filters$]).pipe(
      map(([commentsOpen, matchedComments, flaggedByModerators]) => ({
        commentsOpen,
        matchedComments,
        deleted: flaggedByModerators && !this.utils.isPostDetailPage()
      }))
    );
  }
}
