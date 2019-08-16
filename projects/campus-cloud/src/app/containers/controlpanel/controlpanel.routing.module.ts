import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@campus-cloud/config/guards';
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

      {
        path: 'manage',
        loadChildren: () => import('./manage/manage.module').then((m) => m.ManageModule)
      },

      {
        path: 'notify',
        loadChildren: () => import('./notify/notify.module').then((m) => m.NotifyModule)
      },

      {
        path: 'assess',
        loadChildren: () => import('./assess/assess.module').then((m) => m.AssessModule)
      },

      {
        path: 'audience',
        loadChildren: () => import('./audience/audience.module').then((m) => m.AudienceModule)
      },

      {
        path: 'studio',
        loadChildren: () => import('./customise/customise.module').then((m) => m.CustomiseModule)
      },

      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then((m) => m.AccountModule)
      },

      {
        path: 'api-management',
        loadChildren: () =>
          import('./api-management/api-management.module').then((m) => m.ApiManagementModule)
      },

      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ControlPanelRoutingModule {}
