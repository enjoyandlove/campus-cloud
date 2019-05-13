import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NavigationItemComponent,
  NavigationComponent,
  NavigationBrandComponent
} from './components';

@NgModule({
  exports: [NavigationItemComponent, NavigationComponent, NavigationBrandComponent],
  declarations: [NavigationItemComponent, NavigationComponent, NavigationBrandComponent],
  imports: [CommonModule]
})
export class NavigationModule {}
