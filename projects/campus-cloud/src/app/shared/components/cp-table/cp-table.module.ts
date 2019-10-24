import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CPTableComponent, CPTableCloseComponent, CPTableRichCellComponent } from './components';

@NgModule({
  exports: [CPTableComponent, CPTableCloseComponent, CPTableRichCellComponent],
  declarations: [CPTableComponent, CPTableCloseComponent, CPTableRichCellComponent],
  imports: [CommonModule]
})
export class CPTableModule {}
