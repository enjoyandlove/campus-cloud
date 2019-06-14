import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { OrientationInfoComponent } from '../info';
import { OrientationWallComponent } from '../wall';
import { OrientationDetailsComponent } from './orientation-details.component';

const appRoutes: Routes = [
  {
    path: '',
    component: OrientationDetailsComponent,
    children: [
      {
        path: 'info',
        component: OrientationInfoComponent,
        data: { title: pageTitle.MANAGE_ORIENTATION }
      },

      {
        path: 'todos',
        data: { title: pageTitle.MANAGE_ORIENTATION },
        loadChildren: '../todos/todos.module#TodosModule'
      },

      {
        path: 'feeds',
        data: { title: pageTitle.MANAGE_ORIENTATION },
        component: OrientationWallComponent
      },

      {
        path: 'events',
        data: { title: pageTitle.MANAGE_ORIENTATION },
        loadChildren: '../events/orientation-events.module#OrientationEventsModule'
      },

      {
        path: 'members',
        data: { title: pageTitle.MANAGE_ORIENTATION },
        loadChildren: '../members/orientation-members.module#OrientationMembersModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrientationDetailsRoutingModule {}
