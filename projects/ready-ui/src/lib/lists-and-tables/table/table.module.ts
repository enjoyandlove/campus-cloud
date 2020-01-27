import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableComponent } from './table/table.component';
import { ButtonModule } from '../../actions/button/button.module';
import { TableRowComponent } from './table-row/table-row.component';
import { TableCellComponent } from './table-cell/table-cell.component';
import { IconsModule } from '../../images-and-icons/icons/icons.module';

@NgModule({
  exports: [TableComponent, TableCellComponent, TableRowComponent],
  declarations: [TableComponent, TableCellComponent, TableRowComponent],
  imports: [CommonModule, IconsModule, ButtonModule]
})
export class TableModule {}
