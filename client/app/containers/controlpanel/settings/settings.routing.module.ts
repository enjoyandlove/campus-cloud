import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
