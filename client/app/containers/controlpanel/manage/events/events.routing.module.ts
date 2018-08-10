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
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    data: { zendesk: 'events' },
    canActivate: [PrivilegesGuard],
    component: EventsListComponent
  },
  {
    path: 'create',
    data: { zendesk: 'events' },
    canActivate: [PrivilegesGuard],
    component: EventsCreateComponent
  },
  {
    path: ':eventId',
    data: { zendesk: 'events' },
    canActivate: [PrivilegesGuard],
    component: EventsAttendanceComponent
  },
  {
    path: ':eventId/edit',
    data: { zendesk: 'events' },
    canActivate: [PrivilegesGuard],
    component: EventsEditComponent
  },
  {
    path: ':eventId/info',
    data: { zendesk: 'events' },
    canActivate: [PrivilegesGuard],
    component: EventsInfoComponent
  },

  {
    path: 'import/excel',
    data: { zendesk: 'events' },
    canActivate: [PrivilegesGuard],
    component: EventsExcelComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
