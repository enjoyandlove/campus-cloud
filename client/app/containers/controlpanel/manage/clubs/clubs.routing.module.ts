import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsCreateComponent } from './create';
import { ClubsEditComponent } from './edit';
import { ClubsExcelComponent } from './excel';
import { ClubsListComponent } from './list';

const appRoutes: Routes = [
  { path: '', component: ClubsListComponent, data: { zendesk: 'clubs' } },

  {
    path: 'create',
    component: ClubsCreateComponent,
    data: { zendesk: 'create club' },
  },

  {
    path: ':clubId/edit',
    component: ClubsEditComponent,
    data: { zendesk: 'edit club' },
  },

  {
    path: 'import/excel',
    component: ClubsExcelComponent,
    data: { zendesk: 'import clubs from csv' },
  },

  {
    path: ':clubId',
    loadChildren: './details/details.module#ClubsDetailsModule',
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class ClubsRoutingModule {}
