import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { DashboardBaseComponent } from './base/base.component';
import { AuthGuard, PrivilegesGuard } from '@app/config/guards';
import { DashboardOnboardingComponent } from './onboarding/onboarding.component';

const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { zendesk: 'dashboard' },
    children: [
      {
        path: '',
        component: DashboardBaseComponent
      },
      {
        path: 'onboarding',
        component: DashboardOnboardingComponent,
        canActivate: [PrivilegesGuard]
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
