import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { ServicesListComponent } from './list';
import { ServicesEditComponent } from './edit';
import { ServicesInfoComponent } from './info';
import { ServicesFeedsComponent } from './feeds';
import { ServicesCreateComponent } from './create';
import { ServicesEventsComponent } from './events';
import { ServicesAttendanceComponent } from './attendance';
import { ServicesListMembersComponent } from './members/list/list.component';

import {
  ServicesEventsEditComponent,
  ServicesEventsInfoComponent,
  ServicesEventsExcelComponent,
  ServicesEventsCreateComponent,
  ServicesEventsAttendanceComponent
} from './events/components';

import { ServicesProviderDetailsComponent } from './attendance/components';

/**
 * Excel
 */
import { ServicesExcelComponent } from './excel';
import { ServicesResolver } from './services.resolver';
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    data: { zendesk: 'services' },
    canActivate: [PrivilegesGuard],
    component: ServicesListComponent
  },

  {
    path: 'create',
    canActivate: [PrivilegesGuard],
    component: ServicesCreateComponent,
    data: { zendesk: 'services' }
  },
  {
    path: ':serviceId/info',
    canActivate: [PrivilegesGuard],
    component: ServicesInfoComponent,
    data: { zendesk: 'services' }
  },
  {
    path: ':serviceId/edit',
    canActivate: [PrivilegesGuard],
    component: ServicesEditComponent,
    data: { zendesk: 'services' }
  },
  {
    path: ':serviceId/members',
    canActivate: [PrivilegesGuard],
    component: ServicesListMembersComponent,
    data: { zendesk: 'services' },
    resolve: { service: ServicesResolver }
  },
  {
    path: ':serviceId/feeds',
    canActivate: [PrivilegesGuard],
    component: ServicesFeedsComponent,
    data: { zendesk: 'services' },
    resolve: { service: ServicesResolver }
  },
  {
    path: ':serviceId/events',
    canActivate: [PrivilegesGuard],
    component: ServicesEventsComponent,
    data: { zendesk: 'services' }
  },

  {
    path: ':serviceId/events/create',
    data: { zendesk: 'services' },
    canActivate: [PrivilegesGuard],
    component: ServicesEventsCreateComponent
  },
  {
    path: ':serviceId/events/:eventId',
    data: { zendesk: 'services' },
    canActivate: [PrivilegesGuard],
    component: ServicesEventsAttendanceComponent
  },
  {
    data: { zendesk: 'services' },
    canActivate: [PrivilegesGuard],
    path: ':serviceId/events/:eventId/info',
    component: ServicesEventsInfoComponent
  },

  {
    data: { zendesk: 'services' },
    canActivate: [PrivilegesGuard],
    path: ':serviceId/events/:eventId/edit',
    component: ServicesEventsEditComponent
  },
  {
    data: { zendesk: 'services' },
    canActivate: [PrivilegesGuard],
    path: ':serviceId/events/import/excel',
    component: ServicesEventsExcelComponent
  },
  {
    path: ':serviceId',
    canActivate: [PrivilegesGuard],
    component: ServicesAttendanceComponent,
    data: { zendesk: 'services' }
  },

  {
    path: ':serviceId/provider/:providerId',
    data: { zendesk: 'services' },
    canActivate: [PrivilegesGuard],
    component: ServicesProviderDetailsComponent
  },

  {
    path: 'import/excel',
    canActivate: [PrivilegesGuard],
    component: ServicesExcelComponent,
    data: { zendesk: 'services' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule {}
