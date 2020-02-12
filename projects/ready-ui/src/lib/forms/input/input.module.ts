import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReadyInputDirective } from './ready-input.directive';

@NgModule({
  exports: [ReadyInputDirective],
  declarations: [ReadyInputDirective],
  imports: [CommonModule]
})
export class InputModule {}
