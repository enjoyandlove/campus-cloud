import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LocationExistsGuard } from './guards';
import { LocationsInfoComponent } from './info';
import { LocationsListComponent } from './list';
import { LocationsEditComponent } from './edit';
import { LocationsCreateComponent } from './create';
import { PrivilegesGuard } from '@app/config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: LocationsListComponent,
    data: { zendesk: 'locations' }
  },
  {
    path: 'create',
    canActivate: [PrivilegesGuard],
    component: LocationsCreateComponent,
    data: { zendesk: 'locations' }
  },
  {
    path: ':locationId/edit',
    canActivate: [PrivilegesGuard, LocationExistsGuard],
    component: LocationsEditComponent,
    data: { zendesk: 'locations' }
  },
  {
    path: ':locationId/info',
    canActivate: [PrivilegesGuard, LocationExistsGuard],
    component: LocationsInfoComponent,
    data: { zendesk: 'locations' }
  },
  {
    path: 'categories',
    canActivate: [PrivilegesGuard],
    data: { zendesk: 'categories' },
    loadChildren: './categories/categories.module#CategoriesModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule {}
