import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreListComponent } from './list';
import { pageTitle } from '@campus-cloud/shared/constants';

const appRoutes: Routes = [
  {
    path: '',
    component: StoreListComponent,
    data: { zendesk: 'store', title: pageTitle.MANAGE_DEALS }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class StoreRoutingModule {}
