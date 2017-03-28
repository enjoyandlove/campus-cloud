import { Component, OnInit, Input } from '@angular/core';

import { CPDate } from '../../../../../../../shared/utils';
import { FORMAT } from '../../../../../../../shared/pipes/date.pipe';

@Component({
  selector: 'cp-feed-header',
  templateUrl: './feed-header.component.html',
  styleUrls: ['./feed-header.component.scss']
})
export class FeeHeaderComponent implements OnInit {
  @Input() feed: any;
  CPDate = CPDate;
  FORMAT = FORMAT.SHORT;

  constructor() { }

  ngOnInit() { }
}
