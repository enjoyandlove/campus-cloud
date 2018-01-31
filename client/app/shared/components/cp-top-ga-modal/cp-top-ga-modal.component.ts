import { Component, OnInit, Input } from '@angular/core';
import { CP_TRACK_TO } from '../../directives/index';
import { isCanada } from './../../../config/env/index';

@Component({
  selector: 'cp-top-ga-modal',
  templateUrl: './cp-top-ga-modal.component.html',
  styleUrls: ['./cp-top-ga-modal.component.scss'],
})
export class CPTopGaModalComponent implements OnInit {
  @Input() oldCPUrl: string;

  eventData;
  brandingImage;

  constructor() {}

  ngOnInit() {
    this.brandingImage = require('public/png/branding-image/brand-image.png');

    this.eventData = {
      type: CP_TRACK_TO.GA,
      eventAction: 'Old CP Clicked',
      eventCategory: 'Go Back To CP',
    };

    this.oldCPUrl = isCanada
      ? 'https://ca.oohlalamobile.com/login?no_redirect=true'
      : 'https://oohlalamobile.com/login?no_redirect=true';
  }

}
