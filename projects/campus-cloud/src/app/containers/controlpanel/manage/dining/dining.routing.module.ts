import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DiningListComponent } from './list';
import { DiningInfoComponent } from './info';
import { DiningEditComponent } from './edit';
import { pageTitle } from '@campus-cloud/shared/constants';
import { DiningCreateComponent } from './create';
import { DiningExistGuard } from './guards/dining-exist-guard';

const appRoutes: Routes = [
  {
    path: '',
    component: DiningListComponent,
    data: { zendesk: 'dining', title: pageTitle.MANAGE_DINING }
  },
  {
    path: ':diningId/info',
    canActivate: [DiningExistGuard],
    component: DiningInfoComponent,
    data: { zendesk: 'dining', title: pageTitle.MANAGE_DINING }
  },
  {
    path: 'create',
    component: DiningCreateComponent,
    data: { zendesk: 'dining', title: pageTitle.MANAGE_DINING }
  },
  {
    path: ':diningId/edit',
    canActivate: [DiningExistGuard],
    component: DiningEditComponent,
    data: { zendesk: 'dining', title: pageTitle.MANAGE_DINING }
  },
  {
    path: 'categories',
    data: { zendesk: 'categories' },
    loadChildren: () =>
      import('./categories/dining-categories.module').then((m) => m.DiningCategoriesModule)
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DiningRoutingModule {}
