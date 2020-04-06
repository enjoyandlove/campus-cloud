import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from '../../actions/button/button.module';
import { IconsModule } from '../../images-and-icons/icons/icons.module';
import { GalleryItemComponent } from './gallery-item/gallery-item.component';
import { GalleryGroupComponent } from './gallery-group/gallery-group.component';
import { GalleryAddItemComponent } from './gallery-add-item/gallery-add-item.component';

@NgModule({
  exports: [GalleryGroupComponent, GalleryItemComponent, GalleryAddItemComponent],
  declarations: [GalleryGroupComponent, GalleryItemComponent, GalleryAddItemComponent],
  imports: [CommonModule, IconsModule, ButtonModule]
})
export class GalleryModule {}
