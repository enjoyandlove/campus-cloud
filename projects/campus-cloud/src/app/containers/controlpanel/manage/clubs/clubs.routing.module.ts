import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ClubsEditComponent } from './edit';
import { ClubsListComponent } from './list';
import { ClubsExcelComponent } from './excel';
import { pageTitle } from '@campus-cloud/shared/constants';
import { ClubsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    component: ClubsListComponent,
    data: { zendesk: 'clubs', title: pageTitle.MANAGE_CLUBS, amplitude: 'IGNORE' }
  },

  {
    path: 'create',
    component: ClubsCreateComponent,
    data: { zendesk: 'clubs', title: pageTitle.MANAGE_CLUBS, amplitude: 'IGNORE' }
  },

  {
    path: ':clubId/edit',
    component: ClubsEditComponent,
    data: { zendesk: 'clubs', title: pageTitle.MANAGE_CLUBS, amplitude: 'IGNORE' }
  },

  {
    path: 'import/excel',
    component: ClubsExcelComponent,
    data: { zendesk: 'clubs', title: pageTitle.MANAGE_CLUBS, amplitude: 'Import' }
  },

  {
    path: ':clubId',
    data: { amplitude: 'IGNORE' },
    loadChildren: () => import('./details/details.module').then((m) => m.ClubsDetailsModule)
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ClubsRoutingModule {}
