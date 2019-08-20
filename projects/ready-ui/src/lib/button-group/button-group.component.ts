import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ready-ui-button-group, [ready-ui-button-group]',
  template: `
    <ng-content></ng-content>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./button-group.component.scss'],
  host: {
    class: 'ready-ui-button-group'
  }
})
export class ButtonGroupComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
