import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../../shared/shared.module';
import { EventsModule } from '../../events/events.module';

import { OrientationEventsComponent } from './orientation-events.component';
import { OrientationEventsRoutingModule } from './orientation-events.routing.module';
import {
  OrientationEventsInfoComponent,
  OrientationEventsEditComponent,
  OrientationEventsExcelComponent,
  OrientationEventsCreateComponent,
  OrientationEventsFacebookComponent,
  OrientationEventsAttendanceComponent,
} from './components';

@NgModule({
  declarations: [
    OrientationEventsComponent,
    OrientationEventsEditComponent,
    OrientationEventsInfoComponent,
    OrientationEventsExcelComponent,
    OrientationEventsCreateComponent,
    OrientationEventsFacebookComponent,
    OrientationEventsAttendanceComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    OrientationEventsRoutingModule,
    EventsModule,
  ]
})
export class OrientationEventsModule {}
