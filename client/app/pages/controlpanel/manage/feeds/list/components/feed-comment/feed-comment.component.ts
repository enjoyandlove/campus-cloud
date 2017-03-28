import { Component, OnInit, Input } from '@angular/core';

declare var $: any;

@Component({
  selector: 'cp-feed-comment',
  templateUrl: './feed-comment.component.html',
  styleUrls: ['./feed-comment.component.scss']
})
export class FeedCommentComponent implements OnInit {
  @Input() last: boolean;
  @Input() comment: any;

  isComment = true;
  isDeleteModal;
  isApproveModal;

  onSelected(action) {
    switch (action) {
      case 1:
        this.isApproveModal = true;
        setTimeout(() => { $('#approveFeedModal').modal(); }, 1);
        break;
      case 3:
        this.isDeleteModal = true;
        setTimeout(() => { $('#deleteFeedModal').modal(); }, 1);
        break;
    }
  }

  constructor() { }

  ngOnInit() { }
}
