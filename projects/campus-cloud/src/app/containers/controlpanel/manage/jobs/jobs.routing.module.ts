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
    data: { zendesk: 'Jobs', title: pageTitle.MANAGE_JOBS }
  },
  {
    path: 'create',
    component: JobsCreateComponent,
    data: { zendesk: 'Jobs', title: pageTitle.MANAGE_JOBS }
  },
  {
    path: ':jobId/edit',
    component: JobsEditComponent,
    data: { zendesk: 'Jobs', title: pageTitle.MANAGE_JOBS }
  },
  {
    path: ':jobId/info',
    component: JobsInfoComponent,
    data: { zendesk: 'Jobs', title: pageTitle.MANAGE_JOBS }
  },
  {
    path: 'employers',
    data: { zendesk: 'employers' },
    loadChildren: () => import('./employers/employer.module').then((m) => m.EmployerModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class JobsRoutingModule {}
