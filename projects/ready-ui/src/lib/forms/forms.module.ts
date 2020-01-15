import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextFieldModule } from './text-field/text-field.module';
import { DatepickerModule } from './datepicker/datepicker.module';
import { TextEditorModule } from './text-editor/text-editor.module';
import { ColorPickerModule } from './color-picker/color-picker.module';

@NgModule({
  declarations: [],
  exports: [DatepickerModule, TextEditorModule, ColorPickerModule, TextFieldModule],
  imports: [CommonModule, DatepickerModule, TextEditorModule, ColorPickerModule]
})
export class FormsModule {}
