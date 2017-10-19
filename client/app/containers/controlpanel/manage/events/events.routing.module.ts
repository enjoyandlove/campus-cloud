import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { EventsListComponent } from './list';
import { EventsInfoComponent }  from './info';
import { EventsEditComponent }  from './edit';
import { EventsCreateComponent } from './create';

/**
 * Imports
 */
import { EventsExcelComponent }  from './excel';
import { EventsFacebookComponent }  from './facebook';

/**
 * MISC
 */
import { EventsAttendanceComponent }  from './attendance';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    data: { preload: true },
    component: EventsListComponent
  },
  { path: 'create', component: EventsCreateComponent },
  { path: ':eventId', component: EventsAttendanceComponent },
  { path: ':eventId/edit', component: EventsEditComponent },
  { path: ':eventId/info', component: EventsInfoComponent },

  { path: 'import/excel', component: EventsExcelComponent },
  { path: 'import/facebook', component: EventsFacebookComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EventsRoutingModule {}
