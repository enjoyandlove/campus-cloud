import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PopoverComponent } from './popover/popover.component';
import { PopoverTriggerDirective } from './popover-trigger.directive';

@NgModule({
  exports: [PopoverComponent, PopoverTriggerDirective],
  declarations: [PopoverComponent, PopoverTriggerDirective],
  imports: [CommonModule]
})
export class PopoverModule {}
