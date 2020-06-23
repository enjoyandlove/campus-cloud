import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CardComponent } from './card/card.component';
import { CardDividerComponent } from './card-divider/card-divider.component';

@NgModule({
  exports: [CardComponent, CardDividerComponent],
  declarations: [CardComponent, CardDividerComponent],
  imports: [CommonModule]
})
export class CardModule {}
