import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DealsListComponent } from './list';
import { DealsEditComponent } from './edit';
import { DealsInfoComponent } from './info';
import { DealsCreateComponent } from './create';

import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: DealsListComponent,
    data: { zendesk: 'Deals' }
  },
  {
    path: 'create',
    canActivate: [PrivilegesGuard],
    component: DealsCreateComponent,
    data: { zendesk: 'Deals' }
  },
  {
    path: ':dealId/edit',
    canActivate: [PrivilegesGuard],
    component: DealsEditComponent,
    data: { zendesk: 'Deals' }
  },
  {
    path: ':dealId/info',
    canActivate: [PrivilegesGuard],
    component: DealsInfoComponent,
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
