import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenuComponent } from './components/menu/menu.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { MenuToggleForDirective } from './directives/menu-toggle-for.directive';

@NgModule({
  exports: [MenuComponent, MenuItemComponent, MenuToggleForDirective],
  declarations: [MenuComponent, MenuItemComponent, MenuToggleForDirective],
  imports: [CommonModule, OverlayModule, PortalModule]
})
export class MenuModule {}
