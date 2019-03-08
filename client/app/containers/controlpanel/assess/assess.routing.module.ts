import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrivilegesGuard } from '@app/config/guards';
import { AssessComponent } from './assess.component';
import { CP_PRIVILEGES_MAP } from '@shared/constants';

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: '',
    component: AssessComponent,
    children: [
      {
        path: 'dashboard',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'assessment', privilege: CP_PRIVILEGES_MAP.assessment },
        loadChildren: './engagement/engagement.module#EngagementModule'
      },

      {
        path: 'students',
        canActivate: [PrivilegesGuard],
        data: { zendesk: 'notify', privilege: CP_PRIVILEGES_MAP.assessment },
        loadChildren: './students/students.module#EngagementStudentsModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AssessRoutingModule {}
