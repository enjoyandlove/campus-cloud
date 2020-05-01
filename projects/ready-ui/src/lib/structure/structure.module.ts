import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardModule } from './card/card.module';
import { StackModule } from './stack/stack.module';
import { SkeletonModule } from './skeleton/skeleton.module';

@NgModule({
  exports: [CardModule, StackModule, SkeletonModule],
  imports: [CommonModule]
})
export class StructureModule {}
