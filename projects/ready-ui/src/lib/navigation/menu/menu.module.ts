import { TextModule } from '@ready-education/ready-ui/text';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MenuComponent } from './menu/menu.component';
import { MenuTriggerDirective } from './menu-trigger.directive';
import { MenuDotComponent } from './menu-dot/menu-dot.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuSearchComponent } from './menu-search/menu-search.component';
import { MenuDividerComponent } from './menu-divider/menu-divider.component';
import { MenuSectionComponent } from './menu-section/menu-section.component';
import { ImagesAndIconsModule } from '../../images-and-icons/images-and-icons.module';

@NgModule({
  exports: [
    MenuComponent,
    MenuDotComponent,
    MenuItemComponent,
    MenuSearchComponent,
    MenuDividerComponent,
    MenuSectionComponent,
    MenuTriggerDirective
  ],
  declarations: [
    MenuComponent,
    MenuDotComponent,
    MenuItemComponent,
    MenuSearchComponent,
    MenuTriggerDirective,
    MenuDividerComponent,
    MenuSectionComponent
  ],
  imports: [CommonModule, TextModule, OverlayModule, PortalModule, ImagesAndIconsModule]
})
export class MenuModule {}
