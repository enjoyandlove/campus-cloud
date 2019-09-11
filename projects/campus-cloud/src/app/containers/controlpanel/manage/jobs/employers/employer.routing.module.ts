import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { EmployerListComponent } from './list';

const appRoutes: Routes = [
  {
    path: '',
    component: EmployerListComponent,
    data: { zendesk: 'employer', title: pageTitle.MANAGE_JOBS, amplitude: 'IGNORE' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule {}
