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
  { path: '', component: CalendarsListComponent },
  { path: ':calendarId', component: CalendarsDetailComponent },
  // TODO Split to its own module
  { path: ':calendarId/items/create', component: CalendarsItemCreateComponent },
  {
    path: ':calendarId/items/import',
    component: CalendarsItemsBulkCreateComponent,
  },
  {
    path: ':calendarId/items/:itemId',
    component: CalendarsItemsDetailsComponent,
  },
  {
    path: ':calendarId/items/:itemId/edit',
    component: CalendarsItemsEditComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
