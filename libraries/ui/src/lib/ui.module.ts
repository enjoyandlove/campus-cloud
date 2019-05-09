import { NgModule } from '@angular/core';

import { GroupModule } from './group/group.module';
import { TableModule } from './table/table.module';
import { ButtonModule } from './button/button.module';
import { NavigationModule } from './navigation/navigation.module';
import { ThemeProviderModule } from './theme-provider/theme-provider.module';

@NgModule({
  declarations: [],
  imports: [],
  exports: [TableModule, GroupModule, ButtonModule, NavigationModule, ThemeProviderModule]
})
export class UiModule {}
