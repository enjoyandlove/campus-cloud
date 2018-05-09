import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrientationTodosListComponent } from './list';

const appRoutes: Routes = [
  {
    path: '',
    component: OrientationTodosListComponent,
    data: { zendesk: 'Orientation Todos' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class TodosRoutingModule {}
