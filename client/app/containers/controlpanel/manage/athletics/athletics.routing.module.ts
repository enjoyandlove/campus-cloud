import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { metaTitle } from '@shared/constants';
import { AthleticsListComponent } from './list';
import { AthleticsEditComponent } from './edit';
import { AthleticsExcelComponent } from './excel';
import { AthleticsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    data: { zendesk: 'athletics', title: metaTitle.MANAGE_ATHLETICS },
    component: AthleticsListComponent
  },

  {
    path: 'create',
    data: { zendesk: 'athletics', title: metaTitle.MANAGE_ATHLETICS },
    component: AthleticsCreateComponent
  },

  {
    path: ':clubId/edit',
    data: { zendesk: 'athletics', title: metaTitle.MANAGE_ATHLETICS },
    component: AthleticsEditComponent
  },

  {
    path: 'import/excel',
    data: { zendesk: 'athletics', title: metaTitle.MANAGE_ATHLETICS },
    component: AthleticsExcelComponent
  },

  {
    path: ':clubId',
    loadChildren: './details/athletics-details.module#AthleticsDetailsModule'
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AthleticsRoutingModule {}
