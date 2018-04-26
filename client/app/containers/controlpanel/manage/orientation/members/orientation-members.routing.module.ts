import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrientationMembersComponent } from './orientation-members.component';

const appRoutes: Routes = [{ path: '', component: OrientationMembersComponent }];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrientationMembersRoutingModule {}
