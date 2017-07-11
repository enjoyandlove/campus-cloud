import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { DashboardComponent } from './dashboard.component';
import { DashboardActivityComponent } from './activity';
import { DashboardOverviewComponent } from './overview';


const appRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardOverviewComponent  },
      { path: 'activity', component: DashboardActivityComponent  },
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
