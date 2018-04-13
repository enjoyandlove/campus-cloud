import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListsListComponent } from './list';
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    component: ListsListComponent,
    canActivate: [PrivilegesGuard],
    data: { zendesk: 'lists' }
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class ListsRoutingModule {}
