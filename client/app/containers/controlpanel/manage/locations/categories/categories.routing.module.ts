import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { metaTitle } from '@shared/constants';
import { CategoriesListComponent } from './list';

const appRoutes: Routes = [
  {
    path: 'categories',
    component: CategoriesListComponent,
    data: { zendesk: 'categories', title: metaTitle.MANAGE_LOCATIONS }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}
