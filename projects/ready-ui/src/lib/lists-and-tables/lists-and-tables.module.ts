import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TableModule } from './table/table.module';
import { ResultsListModule } from './results-list/results-list.module';

@NgModule({
  exports: [TableModule, ResultsListModule],
  declarations: [],
  imports: [CommonModule]
})
export class ListsAndTablesModule {}
