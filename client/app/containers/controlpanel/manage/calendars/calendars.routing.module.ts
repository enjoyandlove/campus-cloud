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

import { CalendarsItemsBulkCreateComponent } from './items/bulk-create/calendats-items-bulk-create.component';

const appRoutes: Routes = [
  {
    path: '',
    component: CalendarsListComponent,
    data: { zendesk: 'calendars' }
  },
  {
    path: ':calendarId',
    component: CalendarsDetailComponent,
    data: { zendesk: 'calendars' }
  },
  // TODO Split to its own module
  {
    path: ':calendarId/items/create',
    component: CalendarsItemCreateComponent,
    data: { zendesk: 'calendars' }
  },
  {
    path: ':calendarId/integrations',
    loadChildren: './integrations/items-integrations.module#ItemsIntegrationsModule'
  },
  {
    path: ':calendarId/items/import',
    data: { zendesk: 'calendars' },
    component: CalendarsItemsBulkCreateComponent
  },
  {
    path: ':calendarId/items/:itemId',
    data: { zendesk: 'calendars' },
    component: CalendarsItemsDetailsComponent
  },
  {
    path: ':calendarId/items/:itemId/edit',
    data: { zendesk: 'calendars' },
    component: CalendarsItemsEditComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule {}
