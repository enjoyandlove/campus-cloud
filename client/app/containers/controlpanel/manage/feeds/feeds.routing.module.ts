import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeedsListComponent } from './list';
import { pageTitle } from '@shared/constants';
import { PrivilegesGuard } from '@app/config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: FeedsListComponent,
    data: { zendesk: 'walls', title: pageTitle.MANAGE_WALL }
  },
  {
    path: 'integrations',
    data: { zendesk: 'walls', title: pageTitle.MANAGE_WALL },
    loadChildren: './integrations/walls-integrations.module#WallsIntegrationsModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class FeedsRoutingModule {}
