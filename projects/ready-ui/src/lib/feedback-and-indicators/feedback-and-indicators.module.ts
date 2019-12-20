import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToastModule } from './toast/toast.module';

@NgModule({
  exports: [ToastModule],
  declarations: [],
  imports: [CommonModule, ToastModule]
})
export class FeedbackAndIndicatorsModule {}
