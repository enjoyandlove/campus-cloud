import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DealsListComponent } from './list';
import { DealsEditComponent } from './edit';
import { DealsInfoComponent } from './info';
import { pageTitle } from '@campus-cloud/shared/constants';
import { DealsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: DealsListComponent,
    data: { zendesk: 'Deals', title: pageTitle.MANAGE_DEALS, amplitude: 'IGNORE' }
  },
  {
    path: 'create',
    component: DealsCreateComponent,
    data: { zendesk: 'Deals', title: pageTitle.MANAGE_DEALS, amplitude: 'IGNORE' }
  },
  {
    path: ':dealId/edit',
    component: DealsEditComponent,
    data: { zendesk: 'Deals', title: pageTitle.MANAGE_DEALS, amplitude: 'IGNORE' }
  },
  {
    path: ':dealId/info',
    component: DealsInfoComponent,
    data: { zendesk: 'Deals', title: pageTitle.MANAGE_DEALS, amplitude: 'Info' }
  },
  {
    path: 'stores',
    data: { zendesk: 'stores', amplitude: 'Stores' },
    loadChildren: () => import('./stores/store.module').then((m) => m.StoreModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class DealsRoutingModule {}
