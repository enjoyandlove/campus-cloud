import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HintComponent } from './hint.component';

@NgModule({
  exports: [HintComponent],
  declarations: [HintComponent],
  imports: [CommonModule]
})
export class HintModule {}
