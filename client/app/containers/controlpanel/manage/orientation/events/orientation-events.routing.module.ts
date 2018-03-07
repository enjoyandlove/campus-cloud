import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrientationEventsComponent } from './orientation-events.component';
import {
  OrientationEventsInfoComponent,
  OrientationEventsEditComponent,
  OrientationEventsExcelComponent,
  OrientationEventsCreateComponent,
  OrientationEventsFacebookComponent,
  OrientationEventsAttendanceComponent
} from './components';

const appRoutes: Routes = [
  {
    path: '',
    component: OrientationEventsComponent,
    data: { zendesk: 'orientation events' },
  },
  {
    path: 'create',
    component: OrientationEventsCreateComponent,
    data: { zendesk: 'create orientation event' },
  },
  {
    path: ':eventId',
    component: OrientationEventsAttendanceComponent,
    data: { zendesk: 'orientation event attendance' },
  },
  {
    path: ':eventId/edit',
    component: OrientationEventsEditComponent,
    data: { zendesk: 'edit orientation event' },
  },
  {
    path: ':eventId/info',
    component: OrientationEventsInfoComponent,
    data: { zendesk: 'orientation event details' },
  },

  {
    path: 'import/excel',
    component: OrientationEventsExcelComponent,
    data: { zendesk: 'import orientation events via csv' },
  },
  {
    path: 'import/facebook',
    component: OrientationEventsFacebookComponent,
    data: { zendesk: 'import orientation events via facebook' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})

export class OrientationEventsRoutingModule {}
