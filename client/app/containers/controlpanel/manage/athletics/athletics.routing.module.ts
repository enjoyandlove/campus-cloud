import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AthleticsListComponent } from './list';
import { AthleticsCreateComponent } from './create';
import { AthleticsExcelComponent } from './excel';
import { AthleticsEditComponent } from './edit';
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: '',
    data: { zendesk: 'athletics' },
    canActivate: [PrivilegesGuard],
    component: AthleticsListComponent,
  },

  {
    path: 'create',
    data: { zendesk: 'athletics' },
    canActivate: [PrivilegesGuard],
    component: AthleticsCreateComponent,
  },

  {
    path: ':clubId/edit',
    data: { zendesk: 'athletics' },
    canActivate: [PrivilegesGuard],
    component: AthleticsEditComponent,
  },

  {
    path: 'import/excel',
    data: { zendesk: 'athletics' },
    canActivate: [PrivilegesGuard],
    component: AthleticsExcelComponent,
  },

  {
    path: ':clubId',
    canActivate: [PrivilegesGuard],
    loadChildren: './details/athletics-details.module#AthleticsDetailsModule',
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AthleticsRoutingModule {}
