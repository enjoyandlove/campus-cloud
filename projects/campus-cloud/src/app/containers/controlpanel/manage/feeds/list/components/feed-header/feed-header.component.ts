/*tslint:disable:no-host-metadata-property */
import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';

import { UserStatus } from './../../feeds.status';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { CPDate } from '@campus-cloud/shared/utils';
import { CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cp-feed-header'
  }
})
export class FeedHeaderComponent implements OnInit {
  @Input() feed: any;
  @Input() isComment: boolean;
  @Output() filterByCategory: EventEmitter<any> = new EventEmitter();
  state: any;
  CPDate = CPDate;
  emailTextContent;
  FORMAT = FORMAT.DATETIME;
  activeUser = UserStatus.active;
  deletedUser = UserStatus.deleted;

  constructor(public cpI18n: CPI18nService) {}

  loadCategory(item) {
    this.state = Object.assign({}, this.state, {
      post_types: item.post_type,
      wall_type: 1,
      label: item.channelName,
      action: item.post_type
    });
    this.filterByCategory.emit(this.state);
  }

  ngOnInit() {
    this.emailTextContent =
      this.feed.user_status >= UserStatus.activeWithUnverifiedEmail
        ? `(${this.feed.email})`
        : `(${this.cpI18n.translate('feeds_card_header_deleted_user')})`;
  }
}
