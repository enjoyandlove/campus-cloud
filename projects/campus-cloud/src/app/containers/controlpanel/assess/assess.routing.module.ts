import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrivilegesGuard } from '@campus-cloud/config/guards';
import { AssessComponent } from './assess.component';
import { CP_PRIVILEGES_MAP, pageTitle } from '@campus-cloud/shared/constants';

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: AssessComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [PrivilegesGuard],
        loadChildren: () =>
          import('./engagement/engagement.module').then((m) => m.EngagementModule),
        data: {
          zendesk: 'assessment',
          title: pageTitle.ASSESS_ENGAGEMENT,
          privilege: CP_PRIVILEGES_MAP.assessment
        }
      },

      {
        path: 'students',
        canActivate: [PrivilegesGuard],
        loadChildren: () =>
          import('./students/students.module').then((m) => m.EngagementStudentsModule),
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
