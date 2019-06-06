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

/**
 * MISC
 */
import { pageTitle } from '@shared/constants';
import { EventsAttendanceComponent } from './attendance';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: 'integrations',
    data: { title: pageTitle.MANAGE_EVENTS },
    loadChildren: './integrations/integrations.module#EventIntegrationsModule'
  },

  {
    path: '',
    data: { zendesk: 'events', title: pageTitle.MANAGE_EVENTS },
    component: EventsListComponent
  },
  {
    path: 'create',
    data: { zendesk: 'events', title: pageTitle.MANAGE_EVENTS },
    component: EventsCreateComponent
  },
  {
    path: ':eventId',
    data: { zendesk: 'events', title: pageTitle.MANAGE_EVENTS },
    component: EventsAttendanceComponent
  },
  {
    path: ':eventId/edit',
    data: { zendesk: 'events', title: pageTitle.MANAGE_EVENTS },
    component: EventsEditComponent
  },
  {
    path: ':eventId/info',
    data: { zendesk: 'events', title: pageTitle.MANAGE_EVENTS },
    component: EventsInfoComponent
  },

  {
    path: 'import/excel',
    data: { zendesk: 'events', title: pageTitle.MANAGE_EVENTS },
    component: EventsExcelComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
