import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AthleticsListMembersComponent } from './list';

const appRoutes: Routes = [{ path: '', component: AthleticsListMembersComponent }];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AthleticsMembersRoutingModule {}
