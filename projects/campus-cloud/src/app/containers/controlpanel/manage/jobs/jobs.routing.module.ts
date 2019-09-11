import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobsListComponent } from './list';
import { JobsInfoComponent } from './info';
import { JobsEditComponent } from './edit';
import { pageTitle } from '@campus-cloud/shared/constants';
import { JobsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: JobsListComponent,
    data: { zendesk: 'Jobs', title: pageTitle.MANAGE_JOBS, amplitude: 'IGNORE' }
  },
  {
    path: 'create',
    component: JobsCreateComponent,
    data: { zendesk: 'Jobs', title: pageTitle.MANAGE_JOBS, amplitude: 'IGNORE' }
  },
  {
    path: ':jobId/edit',
    component: JobsEditComponent,
    data: { zendesk: 'Jobs', title: pageTitle.MANAGE_JOBS, amplitude: 'IGNORE' }
  },
  {
    path: ':jobId/info',
    component: JobsInfoComponent,
    data: { zendesk: 'Jobs', title: pageTitle.MANAGE_JOBS, amplitude: 'Info' }
  },
  {
    path: 'employers',
    data: { zendesk: 'employers', amplitude: 'Employers' },
    loadChildren: () => import('./employers/employer.module').then((m) => m.EmployerModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class JobsRoutingModule {}
