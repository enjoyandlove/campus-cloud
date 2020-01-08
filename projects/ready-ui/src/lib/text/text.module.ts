import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StylesDirective } from './styles/styles.directive';

@NgModule({
  exports: [StylesDirective],
  declarations: [StylesDirective],
  imports: [CommonModule]
})
export class TextModule {}
