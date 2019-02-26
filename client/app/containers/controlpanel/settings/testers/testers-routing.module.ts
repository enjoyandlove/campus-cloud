import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { TestersListComponent } from './list/testers-list.component';

const routes: Routes = [{ path: '', component: TestersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestersRoutingModule {}
