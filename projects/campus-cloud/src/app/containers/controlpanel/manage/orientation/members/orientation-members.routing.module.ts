import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrientationMembersListComponent } from './list';

const appRoutes: Routes = [
  { path: '', component: OrientationMembersListComponent, data: { amplitude: 'IGNORE' } }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrientationMembersRoutingModule {}
