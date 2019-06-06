import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrivilegesGuard } from '@app/config/guards';
import { AssessComponent } from './assess.component';
import { CP_PRIVILEGES_MAP, pageTitle } from '@shared/constants';

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: AssessComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [PrivilegesGuard],
        loadChildren: './engagement/engagement.module#EngagementModule',
        data: {
          zendesk: 'assessment',
          title: pageTitle.ASSESS_ENGAGEMENT,
          privilege: CP_PRIVILEGES_MAP.assessment
        }
      },

      {
        path: 'students',
        canActivate: [PrivilegesGuard],
        loadChildren: './students/students.module#EngagementStudentsModule',
        data: {
          zendesk: 'notify',
          title: pageTitle.ASSESS_STUDENT,
          privilege: CP_PRIVILEGES_MAP.assessment
        }
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AssessRoutingModule {}
