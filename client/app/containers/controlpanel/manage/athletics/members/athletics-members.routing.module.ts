import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AthleticsMembersComponent } from './athletics-members.component';

const appRoutes: Routes = [{ path: '', component: AthleticsMembersComponent }];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AthleticsMembersRoutingModule {}
