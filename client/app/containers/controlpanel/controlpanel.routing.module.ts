import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@app/config/guards';
import { ControlPanelComponent } from './controlpanel.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    canActivate: [AuthGuard],
    component: ControlPanelComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
      },

      { path: 'manage', loadChildren: './manage/manage.module#ManageModule' },

      { path: 'notify', loadChildren: './notify/notify.module#NotifyModule' },

      { path: 'assess', loadChildren: './assess/assess.module#AssessModule' },

      { path: 'audience', loadChildren: './audience/audience.module#AudienceModule' },

      {
        path: 'studio',
        loadChildren: './customise/customise.module#CustomiseModule'
      },

      {
        path: 'account',
        loadChildren: './account/account.module#AccountModule'
      },

      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule {}
