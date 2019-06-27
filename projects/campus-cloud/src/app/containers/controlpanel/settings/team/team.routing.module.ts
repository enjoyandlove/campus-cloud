import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { TeamEditComponent } from './edit';
import { TeamListComponent } from './list';
import { TeamCreateComponent } from './create';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { CP_PRIVILEGES_MAP, pageTitle } from '@campus-cloud/shared/constants';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: TeamListComponent,
    data: { zendesk: 'team', privilege: CP_PRIVILEGES_MAP.manage_admin }
  },
  {
    path: 'invite',
    canActivate: [PrivilegesGuard],
    component: TeamCreateComponent,
    data: { zendesk: 'team', privilege: CP_PRIVILEGES_MAP.manage_admin }
  },
  {
    path: ':adminId/edit',
    component: TeamEditComponent,
    data: { zendesk: 'team', title: pageTitle.PROFILE }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class TeamRoutingModule {}
