import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsEventsComponent } from './clubs-events.component';

/**
 * CRUD
 */

import {
  ClubsEventEditComponent,
  ClubsEventInfoComponent,
  ClubsEventsAttendanceComponent,
  ClubsEventsCreateComponent,
  ClubsEventsExcelComponent
} from './components';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    component: ClubsEventsComponent,
    data: { zendesk: 'clubs' }
  },
  {
    path: 'create',
    component: ClubsEventsCreateComponent,
    data: { zendesk: 'clubs' }
  },
  {
    path: ':eventId',
    component: ClubsEventsAttendanceComponent,
    data: { zendesk: 'clubs' }
  },
  {
    path: ':eventId/edit',
    component: ClubsEventEditComponent,
    data: { zendesk: 'clubs' }
  },
  {
    path: ':eventId/info',
    component: ClubsEventInfoComponent,
    data: { zendesk: 'clubs' }
  },

  {
    path: 'import/excel',
    component: ClubsEventsExcelComponent,
    data: { zendesk: 'clubs' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ClubsEventsRoutingModule {}
