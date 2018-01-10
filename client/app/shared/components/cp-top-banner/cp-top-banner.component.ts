import { Component, OnInit } from '@angular/core';

import { isCanada } from './../../../config/env/index';

@Component({
  selector: 'cp-top-banner',
  templateUrl: './cp-top-banner.component.html',
  styleUrls: ['./cp-top-banner.component.scss'],
})
export class CPTopBanerComponent implements OnInit {
  oldCPUrl: string;

  constructor() {}

  ngOnInit() {
    this.oldCPUrl = isCanada
      ? 'https://ca.oohlalamobile.com/login?no_redirect=true'
      : 'https://oohlalamobile.com/login?no_redirect=true';
  }
}
