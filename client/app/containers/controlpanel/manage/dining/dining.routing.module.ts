import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiningListComponent } from './list';
import { DiningInfoComponent } from './info';
import { DiningCreateComponent } from './create';
import { PrivilegesGuard } from '@app/config/guards';
import { DiningExistGuard } from './guards/dining-exist-guard';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: DiningListComponent,
    data: { zendesk: 'dining' }
  },
  {
    path: ':diningId/info',
    canActivate: [PrivilegesGuard, DiningExistGuard],
    component: DiningInfoComponent,
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
