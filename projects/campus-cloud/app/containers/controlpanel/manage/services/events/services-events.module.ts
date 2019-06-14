import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventsModule } from '../../events/events.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { ServicesEventsComponent } from './services-events.component';
import {
  ServicesEventsEditComponent,
  ServicesEventsInfoComponent,
  ServicesEventsExcelComponent,
  ServicesEventsCreateComponent,
  ServicesEventsAttendanceComponent
} from './components';

@NgModule({
  declarations: [
    ServicesEventsComponent,
    ServicesEventsEditComponent,
    ServicesEventsInfoComponent,
    ServicesEventsExcelComponent,
    ServicesEventsCreateComponent,
    ServicesEventsAttendanceComponent
  ],
  imports: [CommonModule, EventsModule, SharedModule]
})
export class ServicesEventsModule {}
