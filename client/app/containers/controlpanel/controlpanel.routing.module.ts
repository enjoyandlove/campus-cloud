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
        loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
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
