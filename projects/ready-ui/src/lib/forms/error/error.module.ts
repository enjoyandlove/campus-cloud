import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ErrorComponent } from './error.component';

@NgModule({
  exports: [ErrorComponent],
  declarations: [ErrorComponent],
  imports: [CommonModule]
})
export class ErrorModule {}
