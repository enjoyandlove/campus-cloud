import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreListComponent } from './list';
import { metaTitle } from '@shared/constants';

const appRoutes: Routes = [
  {
    path: '',
    component: StoreListComponent,
    data: { zendesk: 'store', title: metaTitle.MANAGE_DEALS }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class StoreRoutingModule {}
