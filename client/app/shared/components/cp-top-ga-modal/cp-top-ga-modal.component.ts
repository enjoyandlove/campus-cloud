import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cp-top-ga-modal',
  templateUrl: './cp-top-ga-modal.component.html',
  styleUrls: ['./cp-top-ga-modal.component.scss'],
})
export class CPTopGaModalComponent implements OnInit {
  @Input() oldCPUrl: string;
  brandingImage;
  constructor() {}

  ngOnInit() {
    this.brandingImage = require('public/png/branding-image/brand-image.png');

  }

}
