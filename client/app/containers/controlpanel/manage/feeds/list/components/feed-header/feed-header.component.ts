import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FORMAT } from '../../../../../../../shared/pipes/date';
import { CPDate } from '../../../../../../../shared/utils';

@Component({
  selector: 'cp-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss']
})
export class FeedHeaderComponent {
  @Input() feed: any;
  @Input() isComment: boolean;
  @Output() filterByCategory: EventEmitter<any> = new EventEmitter();
  state: any;
  CPDate = CPDate;
  FORMAT = FORMAT.DATETIME;

  loadCategory(item) {
    this.state = Object.assign({}, this.state, {
      post_types: item.post_type,
      wall_type: 1,
      label: item.channelName,
      action: item.post_type
    });
    this.filterByCategory.emit(this.state);
  }
}
