import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeedsListComponent } from './list';

const appRoutes: Routes = [
  { path: '', component: FeedsListComponent, data: { zendesk: 'Wall' } },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class FeedsRoutingModule {}
