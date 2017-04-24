import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../../feeds.service';

declare var $: any;

@Component({
  selector: 'cp-feed-approve-comment-modal',
  templateUrl: './feed-approve-comment-modal.component.html',
  styleUrls: ['./feed-approve-comment-modal.component.scss']
})
export class FeedApproveCommentModalComponent implements OnInit {
  @Input() feed: any;
  @Input() isCampusWallView: Observable<number>;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() approved: EventEmitter<number> = new EventEmitter();

  _isCampusWallView;

  constructor(
    private feedsService: FeedsService
  ) { }

  onSubmit() {
    let data = { flag: 2 };
    const approveCampusWallComment$ = this
      .feedsService.approveCampusWallComment(this.feed.id, data);
    const approveGroupWallComment$ = this.feedsService.approveGroupWallComment(this.feed.id, data);
    const stream$ = this._isCampusWallView ? approveCampusWallComment$ : approveGroupWallComment$;

    stream$
      .subscribe(
      _ => {
        $('#approveCommentModal').modal('hide');
        this.approved.emit(this.feed.id);
        this.teardown.emit();
      },
      err => console.log(err)
      );
  }

  ngOnInit() {
    this.isCampusWallView.subscribe(res => {
      this._isCampusWallView = res === 1 ? true : false;
    });

    console.log(this._isCampusWallView);
  }
}
