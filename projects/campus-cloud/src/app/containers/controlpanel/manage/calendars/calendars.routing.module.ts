/* tslint:disable:max-line-length */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalendarsListComponent } from './list';
import { CalendarsDetailComponent } from './details';
import {
  CalendarsItemCreateComponent,
  CalendarsItemsDetailsComponent,
  CalendarsItemsEditComponent
} from './items';

import { pageTitle } from '@campus-cloud/shared/constants';
import { CalendarsItemsBulkCreateComponent } from './items/bulk-create/calendats-items-bulk-create.component';

const appRoutes: Routes = [
  {
    path: '',
    component: CalendarsListComponent,
    data: { zendesk: 'calendars', title: pageTitle.MANAGE_CALENDARS }
  },
  {
    path: ':calendarId',
    component: CalendarsDetailComponent,
    data: { zendesk: 'calendars', title: pageTitle.MANAGE_CALENDARS }
  },
  // TODO Split to its own module
  {
    path: ':calendarId/items/create',
    component: CalendarsItemCreateComponent,
    data: { zendesk: 'calendars', title: pageTitle.MANAGE_CALENDARS }
  },
  {
    path: ':calendarId/integrations',
    loadChildren: './integrations/items-integrations.module#ItemsIntegrationsModule'
  },
  {
    path: ':calendarId/items/import',
    component: CalendarsItemsBulkCreateComponent,
    data: { zendesk: 'calendars', title: pageTitle.MANAGE_CALENDARS }
  },
  {
    path: ':calendarId/items/:itemId',
    component: CalendarsItemsDetailsComponent,
    data: { zendesk: 'calendars', title: pageTitle.MANAGE_CALENDARS }
  },
  {
    path: ':calendarId/items/:itemId/edit',
    component: CalendarsItemsEditComponent,
    data: { zendesk: 'calendars', title: pageTitle.MANAGE_CALENDARS }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule {}
