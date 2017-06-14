import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

declare var $: any;

@Component({
  selector: 'cp-feed-comment',
  templateUrl: './feed-comment.component.html',
  styleUrls: ['./feed-comment.component.scss']
})
export class FeedCommentComponent implements OnInit {
  @Input() comment: any;
  @Input() last: boolean;
  @Input() isCampusWallView: Observable<number>;
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  isComment = true;
  isDeleteModal;
  isApproveModal;
  requiresApproval$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  onSelected(action) {
    switch (action) {
      case 1:
        this.isApproveModal = true;
        setTimeout(() => { $('#approveCommentModal').modal(); }, 1);
        break;
      case 3:
        this.isDeleteModal = true;
        setTimeout(() => { $('#deleteFeedCommentModal').modal(); }, 1);
        break;
    }
  }

  constructor() { }

  ngOnInit() {
    this.requiresApproval$.next(this.comment.dislikes > 0 && this.comment.flag !== 2);
    // console.log(this);
  }
}
