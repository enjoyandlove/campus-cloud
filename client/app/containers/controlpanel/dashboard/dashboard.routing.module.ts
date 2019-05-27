import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DashboardBaseComponent } from './base/base.component';
import { AuthGuard, PrivilegesGuard } from '@app/config/guards';
import { CP_PRIVILEGES_MAP, pageTitle } from '@shared/constants';
import { DashboardOnboardingComponent } from './onboarding/onboarding.component';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: { zendesk: 'dashboard', title: pageTitle.DASHBOARD },
    children: [
      {
        path: '',
        component: DashboardBaseComponent
      },
      {
        path: 'onboarding',
        canLoad: [PrivilegesGuard],
        canActivate: [PrivilegesGuard],
        component: DashboardOnboardingComponent,
        data: { privilege: CP_PRIVILEGES_MAP.app_customization }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
