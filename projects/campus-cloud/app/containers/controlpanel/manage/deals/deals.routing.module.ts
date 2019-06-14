import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DealsListComponent } from './list';
import { DealsEditComponent } from './edit';
import { DealsInfoComponent } from './info';
import { pageTitle } from '@shared/constants';
import { DealsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: DealsListComponent,
    data: { zendesk: 'Deals', title: pageTitle.MANAGE_DEALS }
  },
  {
    path: 'create',
    component: DealsCreateComponent,
    data: { zendesk: 'Deals', title: pageTitle.MANAGE_DEALS }
  },
  {
    path: ':dealId/edit',
    component: DealsEditComponent,
    data: { zendesk: 'Deals', title: pageTitle.MANAGE_DEALS }
  },
  {
    path: ':dealId/info',
    component: DealsInfoComponent,
    data: { zendesk: 'Deals', title: pageTitle.MANAGE_DEALS }
  },
  {
    path: 'stores',
    data: { zendesk: 'stores' },
    loadChildren: './stores/store.module#StoreModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DealsRoutingModule {}
