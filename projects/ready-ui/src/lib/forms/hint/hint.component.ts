import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ready-ui-hint',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./hint.component.scss']
})
export class HintComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
