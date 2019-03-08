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
import { EventsAttendanceComponent } from './attendance';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: 'integrations',
    loadChildren: './integrations/integrations.module#EventIntegrationsModule'
  },

  {
    path: '',
    data: { zendesk: 'events' },
    component: EventsListComponent
  },
  {
    path: 'create',
    data: { zendesk: 'events' },
    component: EventsCreateComponent
  },
  {
    path: ':eventId',
    data: { zendesk: 'events' },
    component: EventsAttendanceComponent
  },
  {
    path: ':eventId/edit',
    data: { zendesk: 'events' },
    component: EventsEditComponent
  },
  {
    path: ':eventId/info',
    data: { zendesk: 'events' },
    component: EventsInfoComponent
  },

  {
    path: 'import/excel',
    data: { zendesk: 'events' },
    component: EventsExcelComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
