import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, PrivilegesGuard } from '../../../config/guards';

import { AssessComponent } from './assess.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: AssessComponent,
    canActivate: [AuthGuard],
    canActivateChild: [PrivilegesGuard],
    children: [
      {
        path: 'dashboard',
        data: { zendesk: 'assessment' },
        loadChildren: './engagement/engagement.module#EngagementModule',
      },

      {
        path: 'students',
        data: { zendesk: 'notify' },
        loadChildren: './students/students.module#EngagementStudentsModule',
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AssessRoutingModule {}
