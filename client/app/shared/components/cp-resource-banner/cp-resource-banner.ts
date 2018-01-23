import { Component, Input, OnInit } from '@angular/core';
import { IResourceBanner } from './cp-resource.interface';

@Component({
  selector: 'cp-resource-banner',
  templateUrl: './cp-resource-banner.html',
  styleUrls: ['./cp-resource-banner.scss'],
})
export class CPResourceBannerComponent implements OnInit {
  @Input() resourceBanner: IResourceBanner;

  constructor() {}

  ngOnInit() {
  }
}
