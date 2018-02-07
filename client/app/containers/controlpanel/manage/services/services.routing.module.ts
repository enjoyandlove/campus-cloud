import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { ServicesListComponent } from './list';
import { ServicesEditComponent } from './edit';
import { ServicesInfoComponent } from './info';
import { ServicesCreateComponent } from './create';
import { ServicesEventsComponent } from './events';
import { ServicesAttendanceComponent } from './attendance';

import {
  ServicesEventsEditComponent,
  ServicesEventsInfoComponent,
  ServicesEventsExcelComponent,
  ServicesEventsCreateComponent,
  ServicesEventsFacebookComponent,
  ServicesEventsAttendanceComponent,
} from './events/components';

import { ServicesProviderDetailsComponent } from './attendance/components';

/**
 * Excel
 */
import { ServicesExcelComponent } from './excel';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    data: { zendesk: 'Services' },
    component: ServicesListComponent,
  },

  {
    path: 'create',
    component: ServicesCreateComponent,
    data: { zendesk: 'create a service' },
  },
  {
    path: ':serviceId/info',
    component: ServicesInfoComponent,
    data: { zendesk: 'service info' },
  },
  {
    path: ':serviceId/edit',
    component: ServicesEditComponent,
    data: { zendesk: 'edit service' },
  },
  {
    path: ':serviceId/events',
    component: ServicesEventsComponent,
    data: { zendesk: 'service events' },
  },

  {
    path: ':serviceId/events/create',
    data: { zendesk: 'create service event' },
    component: ServicesEventsCreateComponent,
  },
  {
    path: ':serviceId/events/:eventId',
    data: { zendesk: 'service event attendance' },
    component: ServicesEventsAttendanceComponent,
  },
  {
    data: { zendesk: 'service event info' },
    path: ':serviceId/events/:eventId/info',
    component: ServicesEventsInfoComponent,
  },

  {
    data: { zendesk: 'edit service event' },
    path: ':serviceId/events/:eventId/edit',
    component: ServicesEventsEditComponent,
  },
  {
    data: { zendesk: 'import service event via csv' },
    path: ':serviceId/events/import/excel',
    component: ServicesEventsExcelComponent,
  },
  {
    data: { zendesk: 'import service event from facebook' },
    path: ':serviceId/events/import/facebook',
    component: ServicesEventsFacebookComponent,
  },

  {
    path: ':serviceId',
    component: ServicesAttendanceComponent,
    data: { zendesk: 'service attendance' },
  },

  {
    path: ':serviceId/provider/:providerId',
    data: { zendesk: 'service provider' },
    component: ServicesProviderDetailsComponent,
  },

  {
    path: 'import/excel',
    component: ServicesExcelComponent,
    data: { zendesk: 'import service via csv' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class ServicesRoutingModule {}
