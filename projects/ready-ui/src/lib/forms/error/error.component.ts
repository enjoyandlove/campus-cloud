import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ready-ui-error',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
