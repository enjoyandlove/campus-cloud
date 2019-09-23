import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { FeedsService } from '../../../feeds.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

declare var $: any;

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-approve-comment-modal',
  templateUrl: './feed-approve-comment-modal.component.html',
  styleUrls: ['./feed-approve-comment-modal.component.scss']
})
export class FeedApproveCommentModalComponent implements OnInit, OnDestroy {
  @Input() feed: any;
  @Input() isCampusWallView: Observable<{}>;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() approved: EventEmitter<number> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(private cpI18n: CPI18nService, public feedsService: FeedsService) {}

  onSubmit() {
    const data = { flag: 2 };

    const approveCampusWallComment$ = this.feedsService.approveCampusWallComment(
      this.feed.id,
      data
    );

    const approveGroupWallComment$ = this.feedsService.approveGroupWallComment(this.feed.id, data);

    const stream$ = this._isCampusWallView ? approveCampusWallComment$ : approveGroupWallComment$;

    stream$.subscribe((_) => {
      $('#approveCommentModal').modal('hide');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.approved.emit(this.feed.id);
      this.teardown.emit();
    });
  }

  ngOnInit() {
    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('approve')
    };
    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this._isCampusWallView = res.type === 1;
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
