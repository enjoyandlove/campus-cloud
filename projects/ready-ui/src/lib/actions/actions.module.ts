import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ButtonModule } from './button/button.module';
import { ButtonGroupModule } from './button-group/button-group.module';

@NgModule({
  exports: [ButtonGroupModule, ButtonModule],
  declarations: [],
  imports: [CommonModule, ButtonGroupModule, ButtonModule]
})
export class ActionsModule {}
