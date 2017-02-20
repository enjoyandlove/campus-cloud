import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventsListComponent } from './list';
import { EventsInfoComponent }  from './info';
import { EventsEditComponent }  from './edit';
import { EventsCreateComponent } from './create';
import { EventsAttendanceComponent }  from './attendance';


const appRoutes: Routes = [
  { path: '', component: EventsListComponent },
  { path: 'create', component: EventsCreateComponent },
  { path: ':eventId', component: EventsAttendanceComponent },
  { path: ':eventId/edit', component: EventsEditComponent },
  { path: ':eventId/info', component: EventsInfoComponent },
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
