import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AthleticsListComponent } from './list';
import { AthleticsCreateComponent } from './create';
import { AthleticsExcelComponent } from './excel';
import { AthleticsEditComponent } from './edit';

const appRoutes: Routes = [
  {
    path: '',
    data: { zendesk: 'athletics' },
    component: AthleticsListComponent,
  },

  {
    path: 'create',
    data: { zendesk: 'athletics' },
    component: AthleticsCreateComponent,
  },

  {
    path: ':clubId/edit',
    data: { zendesk: 'athletics' },
    component: AthleticsEditComponent,
  },

  {
    path: 'import/excel',
    data: { zendesk: 'athletics' },
    component: AthleticsExcelComponent,
  },

  {
    path: ':clubId',
    loadChildren: './details/athletics-details.module#AthleticsDetailsModule',
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AthleticsRoutingModule {}
