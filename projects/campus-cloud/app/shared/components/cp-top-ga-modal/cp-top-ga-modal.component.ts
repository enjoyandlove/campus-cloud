import { Component, OnInit, Input } from '@angular/core';

import { CP_TRACK_TO } from '../../directives';
import { isCanada } from './../../../config/env';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'cp-top-ga-modal',
  templateUrl: './cp-top-ga-modal.component.html',
  styleUrls: ['./cp-top-ga-modal.component.scss']
})
export class CPTopGaModalComponent implements OnInit {
  @Input() oldCPUrl: string;

  goToOldCPEventData;
  returnCCEventData;

  brandingImage;

  constructor() {}

  ngOnInit() {
    this.brandingImage = `${environment.root}public/png/branding-image/brand-image.png`;

    this.goToOldCPEventData = {
      type: CP_TRACK_TO.GA,
      eventAction: 'Old CP Clicked',
      eventCategory: 'Go Back To CP'
    };

    this.returnCCEventData = {
      type: CP_TRACK_TO.GA,
      eventAction: 'Return CC Clicked',
      eventCategory: 'Return Back to CC'
    };

    this.oldCPUrl = isCanada
      ? 'https://ca.oohlalamobile.com/login?no_redirect=true'
      : 'https://oohlalamobile.com/login?no_redirect=true';
  }
}
