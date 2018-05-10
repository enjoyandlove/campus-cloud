import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsInfoComponent } from '../info';
import { ClubsWallComponent } from '../wall';

import { ClubsDetailsComponent } from './details.component';

const appRoutes: Routes = [
  {
    path: '',
    component: ClubsDetailsComponent,
    children: [
      { path: 'info', component: ClubsInfoComponent },

      { path: 'feeds', component: ClubsWallComponent },

      {
        path: 'events',
        loadChildren: '../events/events.module#ClubsEventsModule'
      },

      {
        path: 'members',
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
