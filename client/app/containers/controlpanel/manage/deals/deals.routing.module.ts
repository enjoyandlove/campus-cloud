import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DealsListComponent } from './list';
import { DealsEditComponent } from './edit';
import { DealsInfoComponent } from './info';
import { DealsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: DealsListComponent,
    data: { zendesk: 'Deals' }
  },
  {
    path: 'create',
    component: DealsCreateComponent,
    data: { zendesk: 'Deals' }
  },
  {
    path: ':dealId/edit',
    component: DealsEditComponent,
    data: { zendesk: 'Deals' }
  },
  {
    path: ':dealId/info',
    component: DealsInfoComponent,
    data: { zendesk: 'Deals' }
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
