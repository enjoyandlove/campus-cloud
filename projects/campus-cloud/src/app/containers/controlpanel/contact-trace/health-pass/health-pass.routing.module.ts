import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { pageTitle } from '@campus-cloud/shared/constants';
import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { HealthPassComponent } from './health-pass.component';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: HealthPassComponent,
    data: { zendesk: 'health-pass', amplitude: 'IGNORE', title: pageTitle.CONTACT_TRACE_SETTINGS }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class HealthPassRoutingModule {}
