import { Component, OnInit } from '@angular/core';

import { isCanada } from './../../../config/env/index';
import { CP_TRACK_TO } from '../../directives/index';

@Component({
  selector: 'cp-top-banner',
  templateUrl: './cp-top-banner.component.html',
  styleUrls: ['./cp-top-banner.component.scss'],
})
export class CPTopBanerComponent implements OnInit {
  eventData;
  oldCPUrl: string;

  constructor() {}

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.GA,
      eventAction: 'Click Event',
      eventCategory: 'Go Back To CP',
    };

    this.oldCPUrl = isCanada
      ? 'https://ca.oohlalamobile.com/login?no_redirect=true'
      : 'https://oohlalamobile.com/login?no_redirect=true';
  }
}
