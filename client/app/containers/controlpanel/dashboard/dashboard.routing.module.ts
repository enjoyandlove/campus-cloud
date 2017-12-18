import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { DashboardComponent } from './dashboard.component';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    component: DashboardComponent,
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule {}
