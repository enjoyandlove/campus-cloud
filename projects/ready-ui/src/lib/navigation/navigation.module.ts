import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from './tabs/tabs.module';
import { MenuModule } from './menu/menu.module';

@NgModule({
  exports: [TabsModule, MenuModule],
  imports: [CommonModule]
})
export class NavigationModule {}
