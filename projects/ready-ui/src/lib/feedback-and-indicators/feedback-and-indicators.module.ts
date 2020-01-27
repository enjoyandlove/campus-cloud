import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastModule } from './toast/toast.module';
import { SpinnerModule } from './spinner/spinner.module';

@NgModule({
  exports: [ToastModule, SpinnerModule],
  declarations: [],
  imports: [CommonModule, ToastModule, SpinnerModule]
})
export class FeedbackAndIndicatorsModule {}
