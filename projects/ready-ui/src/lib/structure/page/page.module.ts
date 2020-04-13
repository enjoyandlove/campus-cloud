import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TextModule } from '../../text/text.module';
import { PageComponent } from './page/page.component';
import { StackModule } from '../../structure/stack/stack.module';
import { ButtonModule } from '../../actions/button/button.module';
import { PageCrumbsComponent } from './page-crumbs/page-crumbs.component';
import { PageContainerComponent } from './page-container/page-container.component';
import { PageNavigationComponent } from './page-navigation/page-navigation.component';
import { ImagesAndIconsModule } from '../../images-and-icons/images-and-icons.module';
import { PageCrumbsItemComponent } from './page-crumbs-item/page-crumbs-item.component';
import { PageNavigationItemComponent } from './page-navigation-item/page-navigation-item.component';

@NgModule({
  exports: [
    PageComponent,
    PageCrumbsComponent,
    PageContainerComponent,
    PageNavigationComponent,
    PageCrumbsItemComponent,
    PageNavigationItemComponent
  ],
  declarations: [
    PageComponent,
    PageCrumbsComponent,
    PageContainerComponent,
    PageCrumbsItemComponent,
    PageNavigationComponent,
    PageNavigationItemComponent
  ],
  imports: [TextModule, StackModule, CommonModule, ButtonModule, ImagesAndIconsModule]
})
export class PageModule {}
