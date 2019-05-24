import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { metaTitle } from '@shared/constants';
import { DiningCategoriesListComponent } from './list';

const appRoutes: Routes = [
  {
    path: 'categories',
    component: DiningCategoriesListComponent,
    data: { zendesk: 'categories', title: metaTitle.MANAGE_DINING }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DiningCategoriesRoutingModule {}
