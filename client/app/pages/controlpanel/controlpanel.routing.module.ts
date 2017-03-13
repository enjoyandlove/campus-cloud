import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ControlPanelComponent } from './controlpanel.component';

const appRoutes: Routes = [
  // HOME PAGE
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: ControlPanelComponent,
    children: [
      { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },

      { path: 'manage', loadChildren: './manage/manage.module#ManageModule' },

      { path: 'account', loadChildren: './account/account.module#AccountModule' },
    ]
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ControlPanelRoutingModule {}
