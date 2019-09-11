import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DashboardBaseComponent } from './base/base.component';
import { AuthGuard, PrivilegesGuard } from '@campus-cloud/config/guards';
import { CP_PRIVILEGES_MAP, pageTitle } from '@campus-cloud/shared/constants';
import { DashboardOnboardingComponent } from './onboarding/onboarding.component';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: { zendesk: 'dashboard', title: pageTitle.DASHBOARD, amplitude: 'IGNORE' },
    children: [
      {
        path: '',
        data: { amplitude: 'IGNORE' },
        component: DashboardBaseComponent
      },
      {
        path: 'onboarding',
        canLoad: [PrivilegesGuard],
        canActivate: [PrivilegesGuard],
        component: DashboardOnboardingComponent,
        data: { privilege: CP_PRIVILEGES_MAP.app_customization, amplitude: 'Onboarding' }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
