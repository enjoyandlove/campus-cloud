import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiningListComponent } from './list';
import { DiningInfoComponent } from './info';
import { DiningEditComponent } from './edit';
import { DiningCreateComponent } from './create';
import { DiningExistGuard } from './guards/dining-exist-guard';

const appRoutes: Routes = [
  {
    path: '',
    component: DiningListComponent,
    data: { zendesk: 'dining' }
  },
  {
    path: ':diningId/info',
    canActivate: [DiningExistGuard],
    component: DiningInfoComponent,
    data: { zendesk: 'dining' }
  },
  {
    path: 'create',
    component: DiningCreateComponent,
    data: { zendesk: 'dining' }
  },
  {
    path: ':diningId/edit',
    canActivate: [DiningExistGuard],
    component: DiningEditComponent,
    data: { zendesk: 'dining' }
  },
  {
    path: 'categories',
    canActivate: [PrivilegesGuard],
    data: { zendesk: 'categories' },
    loadChildren: './categories/dining-categories.module#DiningCategoriesModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DiningRoutingModule {}
