import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { ClubsEventsComponent } from './clubs-events.component';

import {
  ClubsEventEditComponent,
  ClubsEventInfoComponent,
  ClubsEventsExcelComponent,
  ClubsEventsCreateComponent,
  ClubsEventsFacebookComponent,
  ClubsEventsAttendanceComponent
} from './components';


const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  { path: '', component: ClubsEventsComponent },
  { path: 'create', component: ClubsEventsCreateComponent },
  { path: ':eventId', component: ClubsEventsAttendanceComponent },
  { path: ':eventId/edit', component: ClubsEventEditComponent },
  { path: ':eventId/info', component: ClubsEventInfoComponent },

  { path: 'import/excel', component: ClubsEventsExcelComponent },
  { path: 'import/facebook', component: ClubsEventsFacebookComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ClubsEventsRoutingModule {}
