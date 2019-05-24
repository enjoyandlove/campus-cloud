import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { metaTitle } from '@shared/constants';
import { EmployerListComponent } from './list';

const appRoutes: Routes = [
  {
    path: '',
    component: EmployerListComponent,
    data: { zendesk: 'employer', title: metaTitle.MANAGE_JOBS }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule {}
