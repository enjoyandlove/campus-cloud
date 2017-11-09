import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { CPDate } from '../../../../../../../shared/utils';
import { FORMAT } from '../../../../../../../shared/pipes/date';

declare var $: any;

@Component({
  selector: 'cp-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit {
  @Input() feed: any;
  @Input() isCampusWallView: Observable<any>;
  @Input() isFilteredByRemovedPosts: Observable<any>;
  @Output() moved: EventEmitter<number> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  isMoveModal;
  isDeleteModal;
  isApproveModal;
  isRemovedPosts;
  CPDate = CPDate;
  _isCampusWallView;
  FORMAT = FORMAT.SHORT;
  requiresApproval$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  onSelected(action) {
    switch (action) {
      case 1:
        this.isApproveModal = true;
        setTimeout(() => { $('#approveFeedModal').modal(); }, 1);
        break;
      case 2:
        this.isMoveModal = true;
        setTimeout(() => { $('#moveFeedModal').modal(); }, 1);
        break;
      case 3:
        this.isDeleteModal = true;
        setTimeout(() => { $('#deleteFeedModal').modal(); }, 1);
        break;
    }
  }

  onDeletedComment() {
    this.feed = Object.assign(
      {},
      this.feed,
      { comment_count: this.feed.comment_count - 1 }
    );
  }

  onApprovedPost() {
    this.feed = Object.assign(
      {},
      this.feed,
      { flag: 2 }
    );
    this.requiresApproval$.next(false);
  }

  ngOnInit() {
    this.requiresApproval$.next(this.feed.dislikes > 0 && this.feed.flag !== 2);

    this.isCampusWallView.subscribe(res => this._isCampusWallView = res.type);

    this.isFilteredByRemovedPosts.subscribe(res => this.isRemovedPosts = res);
  }
}
