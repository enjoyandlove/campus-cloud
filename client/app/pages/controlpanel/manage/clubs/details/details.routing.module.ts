import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsInfoComponent } from '../info';
import { ClubsWallComponent } from '../wall';
import { ClubsEditComponent } from '../edit';
// import { ClubsEventsComponent } from '../events';
import { ClubsMembersComponent } from '../members';

import { ClubsDetailsComponent } from './details.component';

const appRoutes: Routes = [
  {
    path: '',
    component: ClubsDetailsComponent,
    children: [
      { path: 'info', component: ClubsInfoComponent },

      { path: 'wall', component: ClubsWallComponent },

      // { path: 'events', component: ClubsEventsComponent },

      { path: 'events', loadChildren: '../events/events.module#ClubsEventsModule' },

      { path: 'members', component: ClubsMembersComponent },

      { path: 'edit', component: ClubsEditComponent }
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ClubsDetailsRoutingModule { }
