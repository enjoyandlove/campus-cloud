import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { TeamEditComponent } from './edit';
import { TeamListComponent } from './list';
import { TeamCreateComponent } from './create';
import { PrivilegesGuard } from '@app/config/guards';
import { CP_PRIVILEGES_MAP } from '@shared/constants';

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
    data: { zendesk: 'team' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class TeamRoutingModule {}
