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
        data: { amplitude: 'Banner' },
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
      },

      {
        path: 'manage',
        data: { amplitude: 'Manage' },
        loadChildren: () => import('./manage/manage.module').then((m) => m.ManageModule)
      },

      {
        path: 'notify',
        data: { amplitude: 'Notify' },
        loadChildren: () => import('./notify/notify.module').then((m) => m.NotifyModule)
      },

      {
        path: 'assess',
        data: { amplitude: 'Assess' },
        loadChildren: () => import('./assess/assess.module').then((m) => m.AssessModule)
      },

      {
        path: 'audience',
        data: { amplitude: 'Audience' },
        loadChildren: () => import('./audience/audience.module').then((m) => m.AudienceModule)
      },

      {
        path: 'studio',
        data: { amplitude: 'Studio' },
        loadChildren: () => import('./customise/customise.module').then((m) => m.CustomiseModule)
      },

      {
        path: 'account',
        data: { amplitude: 'Change Password' },
        loadChildren: () => import('./account/account.module').then((m) => m.AccountModule)
      },

      {
        path: 'campus-app-management',
        data: { amplitude: 'Campus App Management' },
        loadChildren: () =>
          import('./campus-app-management/campus-app-management.module').then(
            (m) => m.CampusAppManagementModule
          )
      },

      {
        path: 'settings',
        data: { amplitude: 'Team Settings' },
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
