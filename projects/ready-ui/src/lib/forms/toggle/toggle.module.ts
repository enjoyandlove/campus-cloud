import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ToggleComponent } from './toggle/toggle.component';

@NgModule({
  exports: [ToggleComponent],
  declarations: [ToggleComponent],
  imports: [CommonModule]
})
export class ToggleModule {}
