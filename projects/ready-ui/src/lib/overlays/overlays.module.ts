import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PopoverModule } from './popover/popover.module';

@NgModule({
  exports: [PopoverModule],
  imports: [CommonModule, PopoverModule]
})
export class OverlaysModule {}
