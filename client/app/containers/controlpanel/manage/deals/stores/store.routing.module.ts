import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreListComponent } from './list';

const appRoutes: Routes = [
  {
    path: '',
    component: StoreListComponent,
    data: { zendesk: 'store' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class StoreRoutingModule {}
