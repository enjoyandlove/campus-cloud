import {
  CP_TRACK_TO,
  IEventData,
} from './../../directives/tracking/tracking.directive';
import { Component, OnInit } from '@angular/core';

import { cpTrackGoogle } from './../../constants/analytics';

@Component({
  selector: 'cp-top-banner',
  templateUrl: './cp-top-banner.component.html',
  styleUrls: ['./cp-top-banner.component.scss'],
})
export class CPTopBanerComponent implements OnInit {
  eventData: IEventData;
  constructor() {}

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.GA,
      eventLabel: cpTrackGoogle.label.CP_TOP_BANNER,
      eventAction: cpTrackGoogle.action.ZENDESK,
      eventCategory: cpTrackGoogle.category.OUTBOUND,
    };
  }
}
