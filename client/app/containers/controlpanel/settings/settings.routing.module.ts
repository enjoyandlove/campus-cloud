import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@app/config/guards';
import { SettingsComponent } from './settings.component';
import { CP_PRIVILEGES_MAP } from '@shared/constants/privileges';

const appRoutes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'team',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'team settings', privilege: CP_PRIVILEGES_MAP.manage_admin },
        loadChildren: './team/team.module#TeamModule'
      },
      {
        path: 'testers',
        canActivate: [PrivilegesGuard],
        data: { privilege: CP_PRIVILEGES_MAP.test_users },
        loadChildren: './testers/campus-testers.module#CampusTestersModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
