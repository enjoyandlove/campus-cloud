import { Component, Input } from '@angular/core';

import { CPDate } from '../../../../../../../shared/utils';
import { FORMAT } from '../../../../../../../shared/pipes/date';

@Component({
  selector: 'cp-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss']
})
export class FeeHeaderComponent {
  @Input() feed: any;
  @Input() isComment: boolean;

  CPDate = CPDate;
  FORMAT = FORMAT.DATETIME;
}
