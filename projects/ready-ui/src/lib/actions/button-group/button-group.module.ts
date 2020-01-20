import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonGroupComponent } from './button-group/button-group.component';

@NgModule({
  exports: [ButtonGroupComponent],
  declarations: [ButtonGroupComponent],
  imports: [CommonModule]
})
export class ButtonGroupModule {}
