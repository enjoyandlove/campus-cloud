import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { ServicesListComponent } from './list';
import { ServicesEditComponent } from './edit';
import { ServicesCreateComponent } from './create';
import { ServicesAttendanceComponent } from './attendance';


const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  { path: '', component: ServicesListComponent },

  { path: 'create', component: ServicesCreateComponent },
  { path: ':serviceId/edit', component: ServicesEditComponent },
  { path: ':serviceId', component: ServicesAttendanceComponent },
  // { path: ':eventId/info', component: EventsInfoComponent },

  // { path: 'import/excel', component: EventsExcelComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ServicesRoutingModule {}
