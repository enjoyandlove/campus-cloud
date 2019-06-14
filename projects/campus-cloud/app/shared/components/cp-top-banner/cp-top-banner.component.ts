import { CPI18nService } from './../../services/i18n.service';
import { CP_TRACK_TO, IEventData } from './../../directives/tracking/tracking.directive';
import { Component, OnInit } from '@angular/core';

import { cpTrackGoogle } from './../../constants/analytics';

@Component({
  selector: 'cp-top-banner',
  templateUrl: './cp-top-banner.component.html',
  styleUrls: ['./cp-top-banner.component.scss']
})
export class CPTopBanerComponent implements OnInit {
  viewMoreUrl;
  eventData: IEventData;

  constructor() {}

  ngOnInit() {
    const zendeskBase = 'https://oohlalamobile.zendesk.com/hc';
    const viewMoreEn = 'en-us/articles/360000901953-Campus-Cloud-is-live-new-and-improved';
    const viewMoreFr = 'fr/articles/360000901953-Campus-Cloud-a-été-mis-à-jour';

    this.viewMoreUrl =
      CPI18nService.getLocale() === 'fr-CA'
        ? `${zendeskBase}/${viewMoreFr}`
        : `${zendeskBase}/${viewMoreEn}`;

    this.eventData = {
      type: CP_TRACK_TO.GA,
      eventLabel: cpTrackGoogle.label.CP_TOP_BANNER,
      eventAction: cpTrackGoogle.action.ZENDESK,
      eventCategory: cpTrackGoogle.category.OUTBOUND
    };
  }
}
