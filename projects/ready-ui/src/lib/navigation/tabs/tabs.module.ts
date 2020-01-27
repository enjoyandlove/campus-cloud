import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabComponent } from './tab/tab.component';
import { TabsComponent } from './tabs/tabs.component';
import { ButtonModule } from '../../actions/button/button.module';

@NgModule({
  exports: [TabsComponent, TabComponent],
  declarations: [TabsComponent, TabComponent],
  imports: [CommonModule, ButtonModule]
})
export class TabsModule {}
