import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  exports: [SpinnerComponent],
  declarations: [SpinnerComponent],
  imports: [CommonModule]
})
export class SpinnerModule {}
