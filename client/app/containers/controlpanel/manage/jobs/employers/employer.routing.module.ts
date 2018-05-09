import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployerListComponent } from './list';

const appRoutes: Routes = [
  {
    path: '',
    component: EmployerListComponent,
    data: { zendesk: 'employer' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule {}
