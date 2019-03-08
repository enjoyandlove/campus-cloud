import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DiningCategoriesListComponent } from './list';

const appRoutes: Routes = [
  {
    path: 'categories',
    component: DiningCategoriesListComponent,
    data: { zendesk: 'categories' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DiningCategoriesRoutingModule {}
