import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { FeedsService } from '../../../feeds.service';

import { CPI18nService } from './../../../../../../../shared/services/i18n.service';

declare var $: any;

@Component({
  selector: 'cp-feed-approve-modal',
  templateUrl: './feed-approve-modal.component.html',
  styleUrls: ['./feed-approve-modal.component.scss']
})
export class FeedApproveModalComponent implements OnInit {
  @Input() feed: any;
  @Input() isCampusWallView: Observable<number>;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() approved: EventEmitter<number> = new EventEmitter();

  buttonData;
  _isCampusWallView;

  constructor(private cpI18n: CPI18nService, private feedsService: FeedsService) {}

  onSubmit() {
    const data = { flag: 2 };

    const approveCampusWallThread$ = this.feedsService.approveCampusWallThread(this.feed.id, data);

    const approveGroupWallThread$ = this.feedsService.approveGroupWallThread(this.feed.id, data);

    const stream$ = this._isCampusWallView ? approveCampusWallThread$ : approveGroupWallThread$;

    stream$.subscribe((_) => {
      $('#approveFeedModal').modal('hide');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: true });
      this.approved.emit(this.feed.id);
      this.teardown.emit();
    });
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('approve'),
      class: 'primary'
    };

    this.isCampusWallView.subscribe((res: any) => {
      this._isCampusWallView = res.type === 1 ? true : false;
    });
  }
}
