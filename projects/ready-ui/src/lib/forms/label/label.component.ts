import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'label[ready-ui-label]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
