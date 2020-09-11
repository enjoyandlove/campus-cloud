import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { HealthDashboardComponent } from './health-dashboard.component';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: HealthDashboardComponent,
    data: {
      zendesk: 'health-dashboard',
      amplitude: 'IGNORE',
      title: pageTitle.CONTACT_TRACE_HEALTH_DASHBOARD
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class HealthPassRoutingModule {}
