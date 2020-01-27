import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StylesComponent } from './styles/styles.component';

@NgModule({
  exports: [StylesComponent],
  declarations: [StylesComponent],
  imports: [CommonModule]
})
export class TextModule {}
