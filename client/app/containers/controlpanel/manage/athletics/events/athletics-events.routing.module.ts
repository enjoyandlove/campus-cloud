import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AthleticsEventsComponent } from './athletics-events.component';

/**
 * CRUD
 */
import {
  AthleticsEventsEditComponent,
  AthleticsEventsInfoComponent,
  AthleticsEventsExcelComponent,
  AthleticsEventsCreateComponent,
  AthleticsEventsAtthendanceComponent
} from './components';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  { path: '', component: AthleticsEventsComponent },

  { path: 'create', component: AthleticsEventsCreateComponent },

  { path: ':eventId', component: AthleticsEventsAtthendanceComponent },

  { path: ':eventId/edit', component: AthleticsEventsEditComponent },

  { path: ':eventId/info', component: AthleticsEventsInfoComponent },

  { path: 'import/excel', component: AthleticsEventsExcelComponent },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AthleticsEventsRoutingModule {}
