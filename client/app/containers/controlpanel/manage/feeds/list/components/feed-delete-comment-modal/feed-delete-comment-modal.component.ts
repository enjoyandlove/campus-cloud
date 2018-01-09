import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../../feeds.service';
import { CPI18nService } from '../../../../../../../shared/services/index';

declare var $: any;

@Component({
  selector: 'cp-feed-delete-comment-modal',
  templateUrl: './feed-delete-comment-modal.component.html',
  styleUrls: ['./feed-delete-comment-modal.component.scss'],
})
export class FeedDeleteCommentModalComponent implements OnInit {
  @Input() feed: any;
  @Input() isCampusWallView: Observable<number>;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  constructor(
    private cpI18n: CPI18nService,
    private feedsService: FeedsService,
  ) {}

  onDelete() {
    const deleteCampusComment$ = this.feedsService.deleteCampusWallCommentByThreadId(
      this.feed.id,
    );
    const deleteGroupComment$ = this.feedsService.deleteGroupWallCommentByThreadId(
      this.feed.id,
    );
    const stream$ = this._isCampusWallView
      ? deleteCampusComment$
      : deleteGroupComment$;

    stream$.subscribe((_) => {
      $('#deleteFeedCommentModal').modal('hide');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.deleted.emit(this.feed.id);
      this.teardown.emit();
    });
  }

  ngOnInit() {
    this.buttonData = {
      class: 'danger',
      text: this.cpI18n.translate('delete'),
    };

    this.isCampusWallView.subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }
}
