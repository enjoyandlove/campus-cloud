import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from './modal/modal.module';
import { TooltipModule } from './tooltip/tooltip.module';
import { PopoverModule } from './popover/popover.module';
import { LightboxModule } from './lightbox/lightbox.module';

@NgModule({
  exports: [PopoverModule, TooltipModule, ModalModule, LightboxModule],
  imports: [CommonModule, PopoverModule, ModalModule]
})
export class OverlaysModule {}
