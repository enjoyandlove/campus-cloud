import { Component, OnInit, Input } from '@angular/core';

import { CPDate } from '../../../../../../../shared/utils';
import { FORMAT } from '../../../../../../../shared/pipes/date.pipe';

@Component({
  selector: 'cp-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss']
})
export class FeedItemComponent implements OnInit {
  @Input() feed: any;
  CPDate = CPDate;
  FORMAT = FORMAT.SHORT;

  constructor() { }

  onSelected(action) {
    console.log(action);
  }

  ngOnInit() {
    // console.log(this);
  }
}
