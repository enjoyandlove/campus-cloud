import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { SettingsComponent } from './settings.component';
import { pageTitle, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';

const appRoutes: Routes = [
  {
    path: '',
    data: { amplitude: 'IGNORE' },
    component: SettingsComponent,
    children: [
      {
        path: 'team',
        loadChildren: () => import('./team/team.module').then((m) => m.TeamModule),
        data: { zendesk: 'team settings', title: pageTitle.TEAM_SETTINGS }
      },
      {
        path: 'testers',
        canActivate: [PrivilegesGuard],
        data: { privilege: CP_PRIVILEGES_MAP.test_users },
        loadChildren: () =>
          import('./testers/campus-testers.module').then((m) => m.CampusTestersModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
