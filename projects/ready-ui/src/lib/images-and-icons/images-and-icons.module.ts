import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconsModule } from './icons/icons.module';
import { ImageModule } from './image/image.module';

@NgModule({
  exports: [IconsModule, ImageModule],
  imports: [CommonModule]
})
export class ImagesAndIconsModule {}
