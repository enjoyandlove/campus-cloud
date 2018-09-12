import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

import settings from '../../../../../../../config/settings';

@Component({
  selector: 'cp-personas-tile-base',
  template: `<div #host class="tile">
    <ng-content></ng-content>
  </div>`,
  styles: [
    `
    .tile {
      width: 100%;
      position: relative;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
    }`
  ]
})
export class PersonasTileBaseComponent implements AfterViewInit, OnInit {
  @Input() ratio = settings.imageRatio;

  @ViewChild('host') host: ElementRef;

  tileHeight: number;

  constructor() {}

  ngAfterViewInit() {
    // get tile width, this is dynamic
    // based on the number of tiles in a row
    const tileWidth = this.host.nativeElement.clientWidth;
    const tileFooterHeight = 37;
    this.tileHeight = tileWidth / this.ratio + tileFooterHeight;
  }

  ngOnInit(): void {}
}
