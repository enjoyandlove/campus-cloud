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
    data: { zendesk: 'services' },
    component: ServicesListComponent,
  },

  {
    path: 'create',
    component: ServicesCreateComponent,
    data: { zendesk: 'services' },
  },
  {
    path: ':serviceId/info',
    component: ServicesInfoComponent,
    data: { zendesk: 'services' },
  },
  {
    path: ':serviceId/edit',
    component: ServicesEditComponent,
    data: { zendesk: 'services' },
  },
  {
    path: ':serviceId/events',
    component: ServicesEventsComponent,
    data: { zendesk: 'services' },
  },

  {
    path: ':serviceId/events/create',
    data: { zendesk: 'services' },
    component: ServicesEventsCreateComponent,
  },
  {
    path: ':serviceId/events/:eventId',
    data: { zendesk: 'services' },
    component: ServicesEventsAttendanceComponent,
  },
  {
    data: { zendesk: 'services' },
    path: ':serviceId/events/:eventId/info',
    component: ServicesEventsInfoComponent,
  },

  {
    data: { zendesk: 'services' },
    path: ':serviceId/events/:eventId/edit',
    component: ServicesEventsEditComponent,
  },
  {
    data: { zendesk: 'services' },
    path: ':serviceId/events/import/excel',
    component: ServicesEventsExcelComponent,
  },
  {
    data: { zendesk: 'services' },
    path: ':serviceId/events/import/facebook',
    component: ServicesEventsFacebookComponent,
  },

  {
    path: ':serviceId',
    component: ServicesAttendanceComponent,
    data: { zendesk: 'services' },
  },

  {
    path: ':serviceId/provider/:providerId',
    data: { zendesk: 'services' },
    component: ServicesProviderDetailsComponent,
  },

  {
    path: 'import/excel',
    component: ServicesExcelComponent,
    data: { zendesk: 'services' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class ServicesRoutingModule {}
