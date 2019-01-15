import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiningListComponent } from './list';
import { DiningCreateComponent } from './create';
import { PrivilegesGuard } from '@app/config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: DiningListComponent,
    data: { zendesk: 'dining' }
  },
  {
    path: 'create',
    canActivate: [PrivilegesGuard],
    component: DiningCreateComponent,
    data: { zendesk: 'dining' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DiningRoutingModule {}
