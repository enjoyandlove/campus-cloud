import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ColorPickerDirective } from './color-picker/color-picker.directive';

@NgModule({
  exports: [ColorPickerDirective],
  declarations: [ColorPickerDirective],
  imports: [CommonModule]
})
export class ColorPickerModule {}
