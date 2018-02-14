import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { EventsListComponent } from './list';
import { EventsInfoComponent } from './info';
import { EventsEditComponent } from './edit';
import { EventsCreateComponent } from './create';

/**
 * Imports
 */
import { EventsExcelComponent } from './excel';
import { EventsFacebookComponent } from './facebook';

/**
 * MISC
 */
import { EventsAttendanceComponent } from './attendance';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    data: { zendesk: 'Events' },
    component: EventsListComponent,
  },
  {
    path: 'create',
    data: { zendesk: 'Events Create' },
    component: EventsCreateComponent,
  },
  {
    path: ':eventId',
    data: { zendesk: 'Events Attendance' },
    component: EventsAttendanceComponent,
  },
  {
    path: ':eventId/edit',
    data: { zendesk: 'Events Edit' },
    component: EventsEditComponent,
  },
  {
    path: ':eventId/info',
    data: { zendesk: 'Events Info' },
    component: EventsInfoComponent,
  },

  {
    path: 'import/excel',
    data: { zendesk: 'Events Import from CSV' },
    component: EventsExcelComponent,
  },
  {
    path: 'import/facebook',
    data: { zendesk: 'Events Import from Facebook' },
    component: EventsFacebookComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}
