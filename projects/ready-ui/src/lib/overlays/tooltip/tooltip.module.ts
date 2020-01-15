import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipDirective } from './tooltip.directive';
import { TooltipComponent } from './tooltip.component';

@NgModule({
  exports: [TooltipDirective],
  entryComponents: [TooltipComponent],
  declarations: [TooltipDirective, TooltipComponent],
  imports: [CommonModule, OverlayModule]
})
export class TooltipModule {}
