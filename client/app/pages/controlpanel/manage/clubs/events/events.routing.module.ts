import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { EventsInfoComponent }  from '../../events/info';
import { EventsEditComponent }  from '../../events/edit';
import { ClubsEventsComponent } from './clubs-events.component';

import {
  ClubsEventsCreateComponent
} from './components';

/**
 * Imports
 */
import { EventsExcelComponent }  from '../../events/excel';
import { EventsFacebookComponent }  from '../../events/facebook';

/**
 * MISC
 */
import { EventsAttendanceComponent }  from '../../events/attendance';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  { path: '', component: ClubsEventsComponent },
  { path: 'create', component: ClubsEventsCreateComponent },
  { path: ':eventId', component: EventsAttendanceComponent },
  { path: ':eventId/edit', component: EventsEditComponent },
  { path: ':eventId/info', component: EventsInfoComponent },

  { path: 'import/excel', component: EventsExcelComponent },
  { path: 'import/facebook', component: EventsFacebookComponent },
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
