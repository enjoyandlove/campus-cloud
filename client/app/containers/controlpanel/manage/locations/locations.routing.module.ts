import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LocationExistsGuard } from './guards';
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
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule {}
