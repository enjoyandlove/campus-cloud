import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import {
  ListActionBoxComponent,
  ListPastComponent,
  ListUpcomingComponent
} from './list/components';

import {
  EventsExcelModalComponent,
  EventsImportActionDropdownComponent,
  EventsImportTopBarComponent
} from './excel/components';

import { EventsEditComponent } from './edit';
import { EventsListComponent } from './list';
import { EventsInfoComponent } from './info';
import { EventsExcelComponent } from './excel';
import { EventsCreateComponent } from './create';
import { EventsDeleteComponent } from './delete';
import { EventsAttendanceComponent } from './attendance';
import { EventsComponent } from './list/base/events.component';
import { EventsAttendanceActionBoxComponent } from './attendance/components';

import { EventsService } from './events.service';
import { EventUtilService } from './events.utils.service';
import { OrientationEventsService } from '../orientation/events/orientation.events.service';

import { EventsRoutingModule } from './events.routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { CheckInModule } from './attendance/check-in/check-in.module';
import { EngagementStudentsModule } from '../../assess/students/students.module';

@NgModule({
  declarations: [
    EventsComponent,
    ListPastComponent,
    EventsListComponent,
    EventsInfoComponent,
    EventsEditComponent,
    EventsExcelComponent,
    EventsCreateComponent,
    EventsDeleteComponent,
    ListUpcomingComponent,
    ListActionBoxComponent,
    EventsAttendanceComponent,
    EventsExcelModalComponent,
    EventsImportTopBarComponent,
    EventsAttendanceActionBoxComponent,
    EventsImportActionDropdownComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    CheckInModule,
    EventsRoutingModule,
    ReactiveFormsModule,
    EngagementStudentsModule
  ],

  providers: [
    EventsService,
    EventUtilService,
    OrientationEventsService
  ],

  exports: [
    EventsComponent,
    ListPastComponent,
    EventsListComponent,
    EventsInfoComponent,
    EventsEditComponent,
    EventsExcelComponent,
    EventsCreateComponent,
    ListUpcomingComponent,
    EventsDeleteComponent,
    ListActionBoxComponent,
    EventsAttendanceComponent,
    EventsExcelModalComponent,
    EventsImportTopBarComponent,
    EventsAttendanceActionBoxComponent,
    EventsImportActionDropdownComponent
  ]
})
export class EventsModule {}
