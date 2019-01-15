import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiningListComponent } from './list';
import { PrivilegesGuard } from '@app/config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: DiningListComponent,
    data: { zendesk: 'dining' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DiningRoutingModule {}
