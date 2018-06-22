import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-personas-tile-base',
  template: `<div class="tile">
    <ng-content></ng-content>
  </div>`,
  styles: [
    `
    .tile {
      width: 100%;
      height: 158px;
      position: relative;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
    }`
  ]
})
export class PseronasTileBaseComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
