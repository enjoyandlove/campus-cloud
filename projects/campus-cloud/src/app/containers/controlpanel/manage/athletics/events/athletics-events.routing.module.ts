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

  { path: '', component: AthleticsEventsComponent, data: { amplitude: 'IGNORE' } },

  { path: 'create', component: AthleticsEventsCreateComponent, data: { amplitude: 'IGNORE' } },

  {
    path: ':eventId',
    data: { amplitude: 'IGNORE' },
    component: AthleticsEventsAtthendanceComponent
  },

  { path: ':eventId/edit', component: AthleticsEventsEditComponent, data: { amplitude: 'IGNORE' } },

  { path: ':eventId/info', component: AthleticsEventsInfoComponent, data: { amplitude: 'IGNORE' } },

  { path: 'import/excel', component: AthleticsEventsExcelComponent, data: { amplitude: 'IGNORE' } }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AthleticsEventsRoutingModule {}
