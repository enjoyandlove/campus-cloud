import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../../feeds.service';
import { CPI18nService } from '../../../../../../../shared/services/index';

declare var $: any;

@Component({
  selector: 'cp-feed-delete-modal',
  templateUrl: './feed-delete-modal.component.html',
  styleUrls: ['./feed-delete-modal.component.scss'],
})
export class FeedDeleteModalComponent implements OnInit {
  @Input() feed: any;
  @Input() isCampusWallView: Observable<number>;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() deleted: EventEmitter<number> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  constructor(
    public cpI18n: CPI18nService,
    public feedsService: FeedsService,
  ) {}

  onDelete() {
    const deleteCampusThread$ = this.feedsService.deleteCampusWallMessageByThreadId(
      this.feed.id,
    );
    const deleteGroupThread$ = this.feedsService.deleteGroupWallMessageByThreadId(
      this.feed.id,
    );
    const stream$ = this._isCampusWallView
      ? deleteCampusThread$
      : deleteGroupThread$;

    stream$.subscribe((_) => {
      $('#deleteFeedModal').modal('hide');
      this.deleted.emit(this.feed.id);
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
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
