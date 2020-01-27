import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DatePickerDirective } from './directives/date-picker.directive';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { DatePreviewerComponent } from './components/date-previewer/date-previewer.component';

@NgModule({
  exports: [DatePickerDirective, DatePickerComponent],
  declarations: [DatePickerDirective, DatePickerComponent, DatePreviewerComponent],
  imports: [CommonModule]
})
export class DatepickerModule {}
