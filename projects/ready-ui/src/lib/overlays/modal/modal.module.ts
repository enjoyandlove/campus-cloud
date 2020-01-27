import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalComponent } from './modal/modal.component';

@NgModule({
  entryComponents: [ModalComponent],
  exports: [ModalComponent],
  declarations: [ModalComponent],
  imports: [CommonModule, OverlayModule, PortalModule]
})
export class ModalModule {}
