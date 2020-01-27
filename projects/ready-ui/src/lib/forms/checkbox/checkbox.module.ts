import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StackModule } from '../../structure/stack/stack.module';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  exports: [CheckboxComponent],
  declarations: [CheckboxComponent],
  imports: [CommonModule, StackModule]
})
export class CheckboxModule {}
