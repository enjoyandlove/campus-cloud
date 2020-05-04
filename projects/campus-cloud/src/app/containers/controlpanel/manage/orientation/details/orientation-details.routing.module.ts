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
        data: { title: pageTitle.MANAGE_ORIENTATION, amplitude: 'Info' }
      },

      {
        path: 'todos',
        data: { title: pageTitle.MANAGE_ORIENTATION, amplitude: 'To-Dos' },
        loadChildren: () => import('../todos/todos.module').then((m) => m.TodosModule)
      },

      {
        path: 'feeds',
        data: { title: pageTitle.MANAGE_ORIENTATION, amplitude: 'Walls' },
        component: OrientationWallComponent
      },

      {
        path: 'events',
        data: { title: pageTitle.MANAGE_ORIENTATION, amplitude: 'Events' },
        loadChildren: () =>
          import('../events/orientation-events.module').then((m) => m.OrientationEventsModule)
      },

      {
        path: 'members',
        data: { title: pageTitle.MANAGE_ORIENTATION, amplitude: 'Members' },
        loadChildren: () =>
          import('../members/orientation-members.module').then((m) => m.OrientationMembersModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrientationDetailsRoutingModule {}
