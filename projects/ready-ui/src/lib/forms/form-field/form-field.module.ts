import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormFieldComponent } from './form-field/form-field.component';

@NgModule({
  exports: [FormFieldComponent],
  declarations: [FormFieldComponent],
  imports: [CommonModule]
})
export class FormFieldModule {}
