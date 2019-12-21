import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ImageComponent } from './image/image.component';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  exports: [ImageComponent, AvatarComponent],
  declarations: [ImageComponent, AvatarComponent],
  imports: [CommonModule]
})
export class ImageModule {}
