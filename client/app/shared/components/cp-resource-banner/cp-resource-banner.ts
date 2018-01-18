import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cp-resource-banner',
  templateUrl: './cp-resource-banner.html',
  styleUrls: ['./cp-resource-banner.scss'],
})
export class CPResourceBannerComponent implements OnInit {
  @Input() resourceBanner;

  constructor() {}

  ngOnInit() {
  }
}
