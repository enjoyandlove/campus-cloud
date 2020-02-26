import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TagComponent } from './tag/tag.component';
import { ButtonModule } from '../../actions/button/button.module';
import { IconsModule } from '../../images-and-icons/icons/icons.module';

@NgModule({
  exports: [TagComponent],
  declarations: [TagComponent],
  imports: [CommonModule, ButtonModule, IconsModule]
})
export class TagModule {}
