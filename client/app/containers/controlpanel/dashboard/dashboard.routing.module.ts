import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { DashboardComponent } from './dashboard.component';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: { zendesk: 'dashboard' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
