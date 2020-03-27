import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LigthboxDirective } from './lightbox/ligthbox.directive';
import { ButtonModule } from '../../actions/button/button.module';
import { LightboxItemDirective } from './lightbox-item/lightbox-item.directive';
import { ImagesAndIconsModule } from '../../images-and-icons/images-and-icons.module';
import { LightboxCarouselComponent } from './lightbox-carousel/lightbox-carousel.component';

@NgModule({
  entryComponents: [LightboxCarouselComponent],
  exports: [LigthboxDirective, LightboxItemDirective],
  declarations: [LigthboxDirective, LightboxItemDirective, LightboxCarouselComponent],
  imports: [CommonModule, OverlayModule, ButtonModule, ImagesAndIconsModule]
})
export class LightboxModule {}
