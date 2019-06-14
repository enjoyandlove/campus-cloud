import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { pageTitle } from '@campus-cloud/shared/constants';
import { DiningCategoriesListComponent } from './list';

const appRoutes: Routes = [
  {
    path: 'categories',
    component: DiningCategoriesListComponent,
    data: { zendesk: 'categories', title: pageTitle.MANAGE_DINING }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DiningCategoriesRoutingModule {}
