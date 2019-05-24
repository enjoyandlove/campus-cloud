import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsInfoComponent } from '../info';
import { ClubsWallComponent } from '../wall';
import { metaTitle } from '@shared/constants';
import { ClubsDetailsComponent } from './details.component';

const appRoutes: Routes = [
  {
    path: '',
    component: ClubsDetailsComponent,
    children: [
      { path: 'info', component: ClubsInfoComponent, data: { title: metaTitle.MANAGE_CLUBS } },

      { path: 'feeds', component: ClubsWallComponent, data: { title: metaTitle.MANAGE_CLUBS } },

      {
        path: 'events',
        data: { title: metaTitle.MANAGE_CLUBS },
        loadChildren: '../events/events.module#ClubsEventsModule'
      },

      {
        path: 'members',
        data: { title: metaTitle.MANAGE_CLUBS },
        loadChildren: '../members/members.module#ClubsMembersModule'
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ClubsDetailsRoutingModule {}
