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

import { PrivilegesGuard } from '../../../../config/guards';
import { CalendarsItemsBulkCreateComponent } from './items/bulk-create/calendats-items-bulk-create.component';

const appRoutes: Routes = [
  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: CalendarsListComponent,
    data: { zendesk: 'calendars' },
  },
  {
    path: ':calendarId',
    canActivate: [PrivilegesGuard],
    component: CalendarsDetailComponent,
    data: { zendesk: 'calendars' },
  },
  // TODO Split to its own module
  {
    path: ':calendarId/items/create',
    canActivate: [PrivilegesGuard],
    component: CalendarsItemCreateComponent,
    data: { zendesk: 'calendars' },
  },
  {
    path: ':calendarId/items/import',
    data: { zendesk: 'calendars' },
    canActivate: [PrivilegesGuard],
    component: CalendarsItemsBulkCreateComponent,
  },
  {
    path: ':calendarId/items/:itemId',
    data: { zendesk: 'calendars' },
    canActivate: [PrivilegesGuard],
    component: CalendarsItemsDetailsComponent,
  },
  {
    path: ':calendarId/items/:itemId/edit',
    data: { zendesk: 'calendars' },
    canActivate: [PrivilegesGuard],
    component: CalendarsItemsEditComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class CalendarRoutingModule {}
