/*tslint:disable:component-selector*/
import {
  OnInit,
  Component,
  HostBinding,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'table[ui-table]',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit {
  constructor() {}

  @HostBinding('class.ui-table')
  ngOnInit() {}
}
