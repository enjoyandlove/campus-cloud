import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DealsListComponent } from './list';

import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: DealsListComponent,
    data: { zendesk: 'Deals' }
  },
  {
    path: 'stores',
    canActivate: [PrivilegesGuard],
    data: { zendesk: 'stores' },
    loadChildren: './stores/store.module#StoreModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DealsRoutingModule {}
