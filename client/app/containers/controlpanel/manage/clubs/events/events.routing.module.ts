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
  ClubsEventsExcelComponent,
  ClubsEventsFacebookComponent,
} from './components';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    component: ClubsEventsComponent,
    data: { zendesk: 'club events' },
  },
  {
    path: 'create',
    component: ClubsEventsCreateComponent,
    data: { zendesk: 'create club event' },
  },
  {
    path: ':eventId',
    component: ClubsEventsAttendanceComponent,
    data: { zendesk: 'club event attendance' },
  },
  {
    path: ':eventId/edit',
    component: ClubsEventEditComponent,
    data: { zendesk: 'edit club event' },
  },
  {
    path: ':eventId/info',
    component: ClubsEventInfoComponent,
    data: { zendesk: 'club event details' },
  },

  {
    path: 'import/excel',
    component: ClubsEventsExcelComponent,
    data: { zendesk: 'import club events via csv' },
  },
  {
    path: 'import/facebook',
    component: ClubsEventsFacebookComponent,
    data: { zendesk: 'import club events via facebook' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class ClubsEventsRoutingModule {}
