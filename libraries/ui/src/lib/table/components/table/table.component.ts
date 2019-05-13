/* tslint:disable:component-selector */
import { Component } from '@angular/core';

@Component({
  selector: 'table[uiTable]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./table.component.scss']
})
export class TableComponent {}

@Component({
  selector: 'thead[uiTableHeader]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./table.component.scss']
})
export class TableHeaderComponent {}

@Component({
  selector: 'tr[uiTableRow]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./table.component.scss']
})
export class TableRowComponent {}

@Component({
  selector: 'td[uiTableCell]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./table.component.scss']
})
export class TableCellComponent {}

@Component({
  selector: 'th[uiTableCellHeader]',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./table.component.scss']
})
export class TableCellHeaderComponent {}
