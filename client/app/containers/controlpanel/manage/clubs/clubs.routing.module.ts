import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ClubsEditComponent } from './edit';
import { ClubsListComponent } from './list';
import { ClubsExcelComponent } from './excel';
import { ClubsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: ClubsListComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: 'create',
    component: ClubsCreateComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: ':clubId/edit',
    component: ClubsEditComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: 'import/excel',
    component: ClubsExcelComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: ':clubId',
    loadChildren: './details/details.module#ClubsDetailsModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ClubsRoutingModule {}
