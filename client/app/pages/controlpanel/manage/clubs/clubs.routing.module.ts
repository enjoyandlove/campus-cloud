import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsListComponent } from './list';
import { ClubsEditComponent } from './edit';
import { ClubsCreateComponent } from './create';

import { ClubsInfoComponent } from './info';
import { ClubsWallComponent } from './wall';
import { ClubsExcelComponent } from './excel';
import { ClubsEventsComponent } from './events';
import { ClubsMembersComponent } from './members';

const appRoutes: Routes = [
  { path: '', component: ClubsListComponent },

  { path: 'create', component: ClubsCreateComponent },

  { path: ':clubId/edit', component: ClubsEditComponent },

  { path: 'import/excel', component: ClubsExcelComponent },

  { path: ':clubId/info', component: ClubsInfoComponent },
  { path: ':clubId/wall', component: ClubsWallComponent },
  { path: ':clubId/events', component: ClubsEventsComponent },
  { path: ':clubId/members', component: ClubsMembersComponent },

];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ClubsRoutingModule {}
