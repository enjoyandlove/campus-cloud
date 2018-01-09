import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LocationsListComponent } from './list';

const appRoutes: Routes = [{ path: '', component: LocationsListComponent }];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class LocationsRoutingModule {}
