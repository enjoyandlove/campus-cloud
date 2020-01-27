/*tslint:disable:component-selector*/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'tr[ui-table-row]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./table-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableRowComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
