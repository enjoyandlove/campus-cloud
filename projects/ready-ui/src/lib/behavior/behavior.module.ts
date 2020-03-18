import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InterceptorDirective } from './interceptor/interceptor.directive';

@NgModule({
  exports: [InterceptorDirective],
  declarations: [InterceptorDirective],
  imports: [CommonModule]
})
export class BehaviorModule {}
