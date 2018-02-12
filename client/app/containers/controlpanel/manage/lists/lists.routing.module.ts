import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListsListComponent } from './list';

const appRoutes: Routes = [
  { path: '', component: ListsListComponent, data: { zendesk: 'Lists' } },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class ListsRoutingModule {}
