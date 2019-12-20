import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DatepickerModule } from './datepicker/datepicker.module';

@NgModule({
  exports: [DatepickerModule],
  declarations: [],
  imports: [CommonModule, DatepickerModule]
})
export class FormsModule {}
