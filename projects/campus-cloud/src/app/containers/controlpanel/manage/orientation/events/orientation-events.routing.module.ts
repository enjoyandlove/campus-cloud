import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrientationEventsComponent } from './orientation-events.component';
import {
  OrientationEventsInfoComponent,
  OrientationEventsEditComponent,
  OrientationEventsExcelComponent,
  OrientationEventsCreateComponent,
  OrientationEventsAttendanceComponent
} from './components';

const appRoutes: Routes = [
  {
    path: '',
    component: OrientationEventsComponent,
    data: { zendesk: 'orientation events', amplitude: 'IGNORE' }
  },
  {
    path: 'create',
    component: OrientationEventsCreateComponent,
    data: { zendesk: 'create orientation event', amplitude: 'IGNORE' }
  },
  {
    path: ':eventId',
    component: OrientationEventsAttendanceComponent,
    data: { zendesk: 'orientation event attendance', amplitude: 'IGNORE' }
  },
  {
    path: ':eventId/edit',
    component: OrientationEventsEditComponent,
    data: { zendesk: 'edit orientation event', amplitude: 'IGNORE' }
  },
  {
    path: ':eventId/info',
    component: OrientationEventsInfoComponent,
    data: { zendesk: 'orientation event details', amplitude: 'IGNORE' }
  },

  {
    path: 'import/excel',
    component: OrientationEventsExcelComponent,
    data: { zendesk: 'import orientation events via csv', amplitude: 'IGNORE' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class OrientationEventsRoutingModule {}
