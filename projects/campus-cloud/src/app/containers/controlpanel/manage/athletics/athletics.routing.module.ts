import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { AthleticsListComponent } from './list';
import { AthleticsEditComponent } from './edit';
import { AthleticsExcelComponent } from './excel';
import { AthleticsCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    data: { zendesk: 'athletics', title: pageTitle.MANAGE_ATHLETICS, amplitude: 'IGNORE' },
    component: AthleticsListComponent
  },

  {
    path: 'create',
    data: { zendesk: 'athletics', title: pageTitle.MANAGE_ATHLETICS, amplitude: 'IGNORE' },
    component: AthleticsCreateComponent
  },

  {
    path: ':clubId/edit',
    data: { zendesk: 'athletics', title: pageTitle.MANAGE_ATHLETICS, amplitude: 'IGNORE' },
    component: AthleticsEditComponent
  },

  {
    path: 'import/excel',
    data: { zendesk: 'athletics', title: pageTitle.MANAGE_ATHLETICS, amplitude: 'IGNORE' },
    component: AthleticsExcelComponent
  },

  {
    path: ':clubId',
    data: { amplitude: 'IGNORE' },
    loadChildren: () =>
      import('./details/athletics-details.module').then((m) => m.AthleticsDetailsModule)
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AthleticsRoutingModule {}
