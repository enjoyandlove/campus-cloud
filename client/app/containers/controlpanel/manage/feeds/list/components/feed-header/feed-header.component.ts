import { Component, Input } from '@angular/core';

import { FORMAT } from '../../../../../../../shared/pipes/date';
import { CPDate } from '../../../../../../../shared/utils';

@Component({
  selector: 'cp-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss'],
})
export class FeedHeaderComponent {
  @Input() feed: any;
  @Input() isComment: boolean;

  CPDate = CPDate;
  FORMAT = FORMAT.DATETIME;
}
