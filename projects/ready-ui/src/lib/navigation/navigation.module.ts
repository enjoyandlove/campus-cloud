import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from './tabs/tabs.module';

@NgModule({
  exports: [TabsModule],
  imports: [CommonModule]
})
export class NavigationModule {}
