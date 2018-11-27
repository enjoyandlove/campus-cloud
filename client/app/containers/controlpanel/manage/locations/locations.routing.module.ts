import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LocationsListComponent } from './list';
import { LocationsCreateComponent } from './create';
import { LocationsUpdateComponent } from './update';
import { PrivilegesGuard } from '../../../../config/guards';

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
    canActivate: [PrivilegesGuard],
    component: LocationsUpdateComponent,
    data: { zendesk: 'locations' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule {}
