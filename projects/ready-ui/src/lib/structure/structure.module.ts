import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardModule } from './card/card.module';
import { StackModule } from './stack/stack.module';

@NgModule({
  exports: [CardModule, StackModule],
  imports: [CommonModule]
})
export class StructureModule {}
