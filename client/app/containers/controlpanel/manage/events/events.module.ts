import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';

import { EventsAttendanceComponent } from './attendance';
import { EventsAttendanceActionBoxComponent } from './attendance/components';
import { EventsCreateComponent } from './create';
import { EventsDeleteComponent } from './delete';
import { EventsEditComponent } from './edit';
import { EventsRoutingModule } from './events.routing.module';
import { EventsService } from './events.service';
import { EventUtilService } from './events.utils.service';
import { EventsExcelComponent } from './excel';
import {
  EventsExcelModalComponent,
  EventsImportActionDropdownComponent,
  EventsImportTopBarComponent
} from './excel/components';
import { EventsInfoComponent } from './info';
import { EventsListComponent } from './list';
import { EventsComponent } from './list/base/events.component';
import {
  ListActionBoxComponent,
  ListPastComponent,
  ListUpcomingComponent
} from './list/components';
import { OrientationEventsService } from '../orientation/events/orientation.events.service';
import { EngagementStudentsModule } from '../../assess/students/students.module';

@NgModule({
  declarations: [
    EventsListComponent,
    EventsCreateComponent,
    EventsAttendanceComponent,
    EventsDeleteComponent,
    EventsInfoComponent,
    EventsEditComponent,
    EventsExcelModalComponent,
    EventsExcelComponent,
    EventsImportActionDropdownComponent,
    EventsImportTopBarComponent,
    ListActionBoxComponent,
    ListPastComponent,
    ListUpcomingComponent,
    EventsAttendanceActionBoxComponent,
    EventsComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    EngagementStudentsModule
  ],

  providers: [EventsService, EventUtilService, OrientationEventsService],

  exports: [
    EventsListComponent,
    EventsCreateComponent,
    EventsAttendanceComponent,
    EventsDeleteComponent,
    EventsInfoComponent,
    EventsEditComponent,
    EventsExcelModalComponent,
    EventsExcelComponent,
    EventsImportActionDropdownComponent,
    EventsImportTopBarComponent,
    ListActionBoxComponent,
    ListPastComponent,
    ListUpcomingComponent,
    EventsAttendanceActionBoxComponent,
    EventsComponent
  ]
})
export class EventsModule {}
