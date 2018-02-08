/* tslint:disable:max-line-length */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarsListComponent } from './list';
import { CalendarsDetailComponent } from './details';
import {
  CalendarsItemCreateComponent,
  CalendarsItemsDetailsComponent,
  CalendarsItemsEditComponent,
} from './items';

import { CalendarsItemsBulkCreateComponent } from './items/bulk-create/calendats-items-bulk-create.component';

const appRoutes: Routes = [
  {
    path: '',
    component: CalendarsListComponent,
    data: { zendesk: 'Calendars' },
  },
  {
    path: ':calendarId',
    component: CalendarsDetailComponent,
    data: { zendesk: 'Calendar Items' },
  },
  // TODO Split to its own module
  {
    path: ':calendarId/items/create',
    component: CalendarsItemCreateComponent,
    data: { zendesk: 'create calendar item' },
  },
  {
    path: ':calendarId/items/import',
    data: { zendesk: 'import calendar items' },
    component: CalendarsItemsBulkCreateComponent,
  },
  {
    path: ':calendarId/items/:itemId',
    data: { zendesk: 'calendar item details' },
    component: CalendarsItemsDetailsComponent,
  },
  {
    path: ':calendarId/items/:itemId/edit',
    data: { zendesk: 'edit calendar item' },
    component: CalendarsItemsEditComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
