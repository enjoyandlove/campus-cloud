import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsCreateComponent } from './create';
import { ClubsEditComponent } from './edit';
import { ClubsExcelComponent } from './excel';
import { ClubsListComponent } from './list';
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: ClubsListComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: 'create',
    canActivate: [PrivilegesGuard],
    component: ClubsCreateComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: ':clubId/edit',
    canActivate: [PrivilegesGuard],
    component: ClubsEditComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: 'import/excel',
    canActivate: [PrivilegesGuard],
    component: ClubsExcelComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: ':clubId',
    canActivate: [PrivilegesGuard],
    data: { zendesk: 'clubs' },
    loadChildren: './details/details.module#ClubsDetailsModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ClubsRoutingModule {}
