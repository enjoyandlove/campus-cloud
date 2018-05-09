import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobsListComponent } from './list';
import { JobsInfoComponent } from './info';
import { JobsEditComponent } from './edit';
import { JobsCreateComponent } from './create';
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: JobsListComponent,
    data: { zendesk: 'Jobs' }
  },
  {
    path: 'create',
    canActivate: [PrivilegesGuard],
    component: JobsCreateComponent,
    data: { zendesk: 'Jobs' }
  },
  {
    path: ':jobId/edit',
    canActivate: [PrivilegesGuard],
    component: JobsEditComponent,
    data: { zendesk: 'Jobs' }
  },
  {
    path: ':jobId/info',
    canActivate: [PrivilegesGuard],
    component: JobsInfoComponent,
    data: { zendesk: 'Jobs' }
  },
  {
    path: 'employers',
    canActivate: [PrivilegesGuard],
    data: { zendesk: 'employers' },
    loadChildren: './employers/employer.module#EmployerModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class JobsRoutingModule {}
