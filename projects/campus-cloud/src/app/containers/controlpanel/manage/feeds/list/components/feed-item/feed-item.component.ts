import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CPDate } from '@campus-cloud/shared/utils';
import { GroupType } from '../../../feeds.utils.service';
import { FORMAT } from '@campus-cloud/shared/pipes/date';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() groupId: number;
  @Input() groupType: GroupType;
  @Input() isCampusWallView: Observable<any>;
  @Input() isFilteredByRemovedPosts: Observable<any>;

  @Output() moved: EventEmitter<number> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() filterByCategory: EventEmitter<any> = new EventEmitter();

  isMoveModal;
  isDeleteModal;
  isApproveModal;
  isRemovedPosts;
  CPDate = CPDate;
  _isCampusWallView;
  FORMAT = FORMAT.SHORT;
  isCommentsOpen: boolean;
  requiresApproval$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor() {}

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
    this.feed = Object.assign({}, this.feed, {
      comment_count: this.feed.comment_count - 1
    });
  }

  onReplied() {
    this.feed = Object.assign({}, this.feed, {
      comment_count: this.feed.comment_count + 1
    });
  }

  onApprovedPost() {
    this.feed = Object.assign({}, this.feed, { flag: 2 });
    this.requiresApproval$.next(false);
  }

  ngOnInit() {
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
