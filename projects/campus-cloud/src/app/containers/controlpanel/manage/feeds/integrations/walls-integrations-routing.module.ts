import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WallsIntegrationsListComponent } from './list';

const routes: Routes = [{ path: '', component: WallsIntegrationsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WallsIntegrationsRoutingModule {}
