import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../store';

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

  constructor(
    private cpI18n: CPI18nService,
    public feedsService: FeedsService,
    private store: Store<fromStore.IWallsState>
  ) {}

  onSubmit() {
    const data = { flag: 2 };

    const updateCampusWallComment$ = this.feedsService.updateCampusWallComment(this.feed.id, data);

    const updateGroupWallComment$ = this.feedsService.updateGroupWallComment(this.feed.id, data);

    const stream$ = this._isCampusWallView ? updateCampusWallComment$ : updateGroupWallComment$;

    stream$.subscribe((updatedComment) => {
      $('#approveCommentModal').modal('hide');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.store.dispatch(fromStore.updateComment({ comment: updatedComment }));
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
