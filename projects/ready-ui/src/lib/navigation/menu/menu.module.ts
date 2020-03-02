import { TextModule } from '@ready-education/ready-ui/text';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenuComponent } from './menu/menu.component';
import { MenuTriggerDirective } from './menu-trigger.directive';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuDividerComponent } from './menu-divider/menu-divider.component';
import { MenuSectionComponent } from './menu-section/menu-section.component';

@NgModule({
  exports: [
    MenuComponent,
    MenuItemComponent,
    MenuTriggerDirective,
    MenuDividerComponent,
    MenuSectionComponent
  ],
  declarations: [
    MenuComponent,
    MenuItemComponent,
    MenuTriggerDirective,
    MenuDividerComponent,
    MenuSectionComponent
  ],
  imports: [CommonModule, TextModule, OverlayModule, PortalModule]
})
export class MenuModule {}
