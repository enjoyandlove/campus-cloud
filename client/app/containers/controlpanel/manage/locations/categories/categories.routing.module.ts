import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesListComponent } from './list';

const appRoutes: Routes = [
  {
    path: '',
    component: CategoriesListComponent,
    data: { zendesk: 'categories' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {}
