import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { DashboardComponent } from './dashboard.component';
import { DashboardOverviewComponent } from './overview';


const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardOverviewComponent  },
    ]
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
