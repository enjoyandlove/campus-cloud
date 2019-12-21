import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IconComponent } from './icon/icon.component';
import { SymbolComponent } from './symbol/symbol.component';

@NgModule({
  exports: [IconComponent, SymbolComponent],
  declarations: [IconComponent, SymbolComponent],
  imports: [CommonModule]
})
export class IconsModule {}
