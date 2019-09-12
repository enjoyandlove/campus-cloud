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
    data: { zendesk: 'clubs', amplitude: 'IGNORE' }
  },
  {
    path: 'create',
    component: ClubsEventsCreateComponent,
    data: { zendesk: 'clubs', amplitude: 'IGNORE' }
  },
  {
    path: ':eventId',
    component: ClubsEventsAttendanceComponent,
    data: { zendesk: 'clubs', amplitude: 'IGNORE' }
  },
  {
    path: ':eventId/edit',
    component: ClubsEventEditComponent,
    data: { zendesk: 'clubs', amplitude: 'IGNORE' }
  },
  {
    path: ':eventId/info',
    component: ClubsEventInfoComponent,
    data: { zendesk: 'clubs', amplitude: 'IGNORE' }
  },

  {
    path: 'import/excel',
    component: ClubsEventsExcelComponent,
    data: { zendesk: 'clubs', amplitude: 'IGNORE' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ClubsEventsRoutingModule {}
