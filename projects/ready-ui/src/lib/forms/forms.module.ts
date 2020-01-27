import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SelectModule } from './select/select.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { TextFieldModule } from './text-field/text-field.module';
import { DatepickerModule } from './datepicker/datepicker.module';
import { TextEditorModule } from './text-editor/text-editor.module';
import { ColorPickerModule } from './color-picker/color-picker.module';

@NgModule({
  declarations: [],
  exports: [
    SelectModule,
    CheckboxModule,
    TextFieldModule,
    DatepickerModule,
    TextEditorModule,
    ColorPickerModule
  ],
  imports: [
    SelectModule,
    CommonModule,
    CheckboxModule,
    DatepickerModule,
    TextEditorModule,
    ColorPickerModule
  ]
})
export class FormsModule {}
