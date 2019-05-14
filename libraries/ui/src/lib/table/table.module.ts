import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  TableComponent,
  TableRowComponent,
  TableCellComponent,
  TableHeaderComponent,
  TableCellHeaderComponent
} from './components';

@NgModule({
  exports: [
    TableComponent,
    TableRowComponent,
    TableCellComponent,
    TableHeaderComponent,
    TableCellHeaderComponent
  ],
  declarations: [
    TableComponent,
    TableRowComponent,
    TableCellComponent,
    TableHeaderComponent,
    TableCellHeaderComponent
  ],
  imports: [CommonModule]
})
export class TableModule {}
