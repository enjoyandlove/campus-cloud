import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StackModule } from '../../structure/stack/stack.module';
import { ButtonModule } from '../../actions/button/button.module';
import { IconsModule } from '../../images-and-icons/icons/icons.module';
import { GalleryItemComponent } from './gallery-item/gallery-item.component';
import { GalleryGroupComponent } from './gallery-group/gallery-group.component';
import { GalleryAddItemComponent } from './gallery-add-item/gallery-add-item.component';

@NgModule({
  exports: [GalleryGroupComponent, GalleryItemComponent, GalleryAddItemComponent],
  declarations: [GalleryGroupComponent, GalleryItemComponent, GalleryAddItemComponent],
  imports: [CommonModule, IconsModule, StackModule, ButtonModule]
})
export class GalleryModule {}
