import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { CategoriesListComponent } from './list';

const appRoutes: Routes = [
  {
    path: 'categories',
    component: CategoriesListComponent,
    data: { zendesk: 'categories', title: pageTitle.MANAGE_LOCATIONS }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}
