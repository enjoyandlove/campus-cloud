import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TagModule } from './tag/tag.module';
import { HintModule } from './hint/hint.module';
import { LabelModule } from './label/label.module';
import { InputModule } from './input/input.module';
import { ErrorModule } from './error/error.module';
import { SelectModule } from './select/select.module';
import { ToggleModule } from './toggle/toggle.module';
import { CheckboxModule } from './checkbox/checkbox.module';
import { FormFieldModule } from './form-field/form-field.module';
import { DatepickerModule } from './datepicker/datepicker.module';
import { TextEditorModule } from './text-editor/text-editor.module';
import { ColorPickerModule } from './color-picker/color-picker.module';

@NgModule({
  declarations: [],
  exports: [
    TagModule,
    HintModule,
    LabelModule,
    InputModule,
    ErrorModule,
    ToggleModule,
    SelectModule,
    CheckboxModule,
    FormFieldModule,
    DatepickerModule,
    TextEditorModule,
    ColorPickerModule
  ],
  imports: [
    TagModule,
    HintModule,
    LabelModule,
    ErrorModule,
    InputModule,
    SelectModule,
    CommonModule,
    ToggleModule,
    CheckboxModule,
    FormFieldModule,
    DatepickerModule,
    TextEditorModule,
    ColorPickerModule
  ]
})
export class FormsModule {}
