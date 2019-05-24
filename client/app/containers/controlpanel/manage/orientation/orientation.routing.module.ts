import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { metaTitle } from '@shared/constants';
import { OrientationListComponent } from './list';

const appRoutes: Routes = [
  {
    path: '',
    component: OrientationListComponent,
    data: { zendesk: 'Orientation', title: metaTitle.MANAGE_ORIENTATION }
  },
  {
    path: ':orientationId',
    loadChildren: './details/orientation-details.module#OrientationDetailsModule',
    data: { zendesk: 'Orientation' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrientationRoutingModule {}
