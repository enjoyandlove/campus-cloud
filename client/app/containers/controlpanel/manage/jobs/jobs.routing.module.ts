import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobsListComponent } from './list';
import { JobsInfoComponent } from './info';
import { JobsEditComponent } from './edit';
import { JobsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: JobsListComponent,
    data: { zendesk: 'Jobs' }
  },
  {
    path: 'create',
    component: JobsCreateComponent,
    data: { zendesk: 'Jobs' }
  },
  {
    path: ':jobId/edit',
    component: JobsEditComponent,
    data: { zendesk: 'Jobs' }
  },
  {
    path: ':jobId/info',
    component: JobsInfoComponent,
    data: { zendesk: 'Jobs' }
  },
  {
    path: 'employers',
    data: { zendesk: 'employers' },
    loadChildren: './employers/employer.module#EmployerModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class JobsRoutingModule {}
