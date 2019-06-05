import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsInfoComponent } from '../info';
import { ClubsWallComponent } from '../wall';
import { pageTitle } from '@shared/constants';
import { ClubsDetailsComponent } from './details.component';

const appRoutes: Routes = [
  {
    path: '',
    component: ClubsDetailsComponent,
    children: [
      { path: 'info', component: ClubsInfoComponent, data: { title: pageTitle.MANAGE_CLUBS } },

      { path: 'feeds', component: ClubsWallComponent, data: { title: pageTitle.MANAGE_CLUBS } },

      {
        path: 'events',
        data: { title: pageTitle.MANAGE_CLUBS },
        loadChildren: () => import('../events/events.module').then((m) => m.ClubsEventsModule)
      },

      {
        path: 'members',
        data: { title: pageTitle.MANAGE_CLUBS },
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
