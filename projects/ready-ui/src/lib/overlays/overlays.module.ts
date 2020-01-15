import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from './tooltip/tooltip.module';
import { PopoverModule } from './popover/popover.module';

@NgModule({
  exports: [PopoverModule, TooltipModule],
  imports: [CommonModule, PopoverModule]
})
export class OverlaysModule {}
