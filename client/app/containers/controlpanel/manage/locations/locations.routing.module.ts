import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LocationsListComponent } from './list';
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: LocationsListComponent,
    data: { zendesk: 'locations' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule {}
