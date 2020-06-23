import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromStore from '@controlpanel/manage/feeds/store';
import {
  ICampusThread,
  ISocialGroup,
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
  @Input() feed: ICampusThread | ISocialGroupThread;
  @Input() mode: 'default' | 'search' | 'inline' = 'default';
  @Input() comment: ICampusThreadComment | ISocialGroupThreadComment;

  @Input() readOnlyMode = false;
  @Input() isCampusWallView: Observable<any>;

  @Output() moved: EventEmitter<any> = new EventEmitter();
  @Output() approved: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() filterByCategory: EventEmitter<any> = new EventEmitter();

  isMoveModal;
  isDeleteModal;
  isApproveModal;

  constructor(private store: Store<fromStore.IWallsState>) {}

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

  onDeleted() {
    this.deleted.emit();
  }

  ngOnInit() {}
}
