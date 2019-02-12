import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeedsListComponent } from './list';
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: FeedsListComponent,
    data: { zendesk: 'walls' }
  },
  {
    path: 'integrations',
    loadChildren: './integrations/walls-integrations.module#WallsIntegrationsModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class FeedsRoutingModule {}
