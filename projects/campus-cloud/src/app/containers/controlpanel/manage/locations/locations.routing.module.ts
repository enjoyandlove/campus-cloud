import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { LocationExistsGuard } from './guards';
import { LocationsInfoComponent } from './info';
import { LocationsListComponent } from './list';
import { LocationsEditComponent } from './edit';
import { LocationsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: LocationsListComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS }
  },
  {
    path: 'create',
    component: LocationsCreateComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS }
  },
  {
    path: ':locationId/edit',
    canActivate: [LocationExistsGuard],
    component: LocationsEditComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS }
  },
  {
    path: ':locationId/info',
    canActivate: [LocationExistsGuard],
    component: LocationsInfoComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS }
  },
  {
    path: 'categories',
    data: { zendesk: 'categories' },
    loadChildren: './categories/categories.module#CategoriesModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule {}
