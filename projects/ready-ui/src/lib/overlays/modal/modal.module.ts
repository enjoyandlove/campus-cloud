import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalComponent } from './modal/modal.component';
import { StackModule } from '../../structure/stack/stack.module';
import { ButtonModule } from '../../actions/button/button.module';
import { ModalFooterComponent } from './modal-footer/modal-footer.component';
import { ModalHeaderComponent } from './modal-header/modal-header.component';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { ModalDividerComponent } from './modal-divider/modal-divider.component';
import { ImagesAndIconsModule } from '../../images-and-icons/images-and-icons.module';

@NgModule({
  entryComponents: [ModalComponent],
  exports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    ModalContentComponent,
    ModalDividerComponent
  ],
  declarations: [
    ModalComponent,
    ModalHeaderComponent,
    ModalFooterComponent,
    ModalContentComponent,
    ModalDividerComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    OverlayModule,
    StackModule,
    PortalModule,
    ImagesAndIconsModule
  ]
})
export class ModalModule {}
