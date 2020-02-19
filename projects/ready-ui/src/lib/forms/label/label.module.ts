import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from './label.component';

@NgModule({
  exports: [LabelComponent],
  declarations: [LabelComponent],
  imports: [CommonModule]
})
export class LabelModule {}
