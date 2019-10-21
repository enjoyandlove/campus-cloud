import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BarComponent } from './components/bar/bar.component';
import { LineComponent } from './components/line/line.component';

@NgModule({
  exports: [BarComponent, LineComponent],
  declarations: [LineComponent, BarComponent],
  imports: [CommonModule]
})
export class ChartsModule {}
