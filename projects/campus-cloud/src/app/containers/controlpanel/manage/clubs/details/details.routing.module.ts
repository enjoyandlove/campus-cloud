import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsInfoComponent } from '../info';
import { ClubsWallComponent } from '../wall';
import { pageTitle } from '@campus-cloud/shared/constants';
import { ClubsDetailsComponent } from './details.component';

const appRoutes: Routes = [
  {
    path: '',
    data: { amplitude: 'IGNORE' },
    component: ClubsDetailsComponent,
    children: [
      {
        path: 'info',
        component: ClubsInfoComponent,
        data: { title: pageTitle.MANAGE_CLUBS, amplitude: 'Info' }
      },

      {
        path: 'feeds',
        component: ClubsWallComponent,
        data: { title: pageTitle.MANAGE_CLUBS, amplitude: 'Walls' }
      },

      {
        path: 'events',
        data: { title: pageTitle.MANAGE_CLUBS, amplitude: 'Events' },
        loadChildren: () => import('../events/events.module').then((m) => m.ClubsEventsModule)
      },

      {
        path: 'members',
        data: { title: pageTitle.MANAGE_CLUBS, amplitude: 'Members' },
        loadChildren: () => import('../members/members.module').then((m) => m.ClubsMembersModule)
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ClubsDetailsRoutingModule {}
