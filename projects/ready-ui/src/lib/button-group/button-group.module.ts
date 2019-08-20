import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonGroupComponent } from './button-group.component';

@NgModule({
  exports: [ButtonGroupComponent],
  declarations: [ButtonGroupComponent],
  imports: [CommonModule]
})
export class ButtonGroupModule {}
