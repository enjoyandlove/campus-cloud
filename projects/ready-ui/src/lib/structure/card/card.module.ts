import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardComponent } from './card/card.component';

@NgModule({
  exports: [CardComponent],
  declarations: [CardComponent],
  imports: [CommonModule]
})
export class CardModule {}
