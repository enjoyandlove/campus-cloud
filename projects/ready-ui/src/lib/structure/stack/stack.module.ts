import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StackComponent } from './stack/stack.component';

@NgModule({
  exports: [StackComponent],
  declarations: [StackComponent],
  imports: [CommonModule]
})
export class StackModule {}
