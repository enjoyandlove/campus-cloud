import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeedsListComponent } from './list';
import { pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { FeedsResetStateGuard } from './feeds-reset-state.guard';
import { FeedsInfoComponent } from '@controlpanel/manage/feeds/info';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: FeedsListComponent,
    canDeactivate: [FeedsResetStateGuard],
    data: { zendesk: 'walls', title: pageTitle.MANAGE_WALL, amplitude: 'IGNORE' }
  },
  {
    path: ':feedId/info',
    canActivate: [PrivilegesGuard],
    component: FeedsInfoComponent,
    canDeactivate: [FeedsResetStateGuard],
    data: { zendesk: 'walls', title: pageTitle.MANAGE_WALL, amplitude: 'Info' }
  },
  {
    path: 'integrations',
    canDeactivate: [FeedsResetStateGuard],
    data: { zendesk: 'walls', title: pageTitle.MANAGE_WALL, amplitude: 'Integrations' },
    loadChildren: () =>
      import('./integrations/walls-integrations.module').then((m) => m.WallsIntegrationsModule)
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class FeedsRoutingModule {}
