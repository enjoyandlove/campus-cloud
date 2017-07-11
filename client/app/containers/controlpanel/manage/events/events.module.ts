import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { EventsInfoComponent }  from './info';
import { EventsListComponent }  from './list';
import { EventsEditComponent }  from './edit';
import { EventsExcelComponent }  from './excel';
import { EventsCreateComponent } from './create';
import { EventsDeleteComponent }  from './delete';
import { EventsFacebookComponent }  from './facebook';
import { EventsAttendanceComponent }  from './attendance';

import { EventsService } from './events.service';
import { EventsRoutingModule } from './events.routing.module';

import {
  ListPastComponent,
  ListUpcomingComponent,
  ListActionBoxComponent
} from './list/components';

import {
  FacebookEventsDeleteComponent,
  FacebookEventsCreateComponent,
  FacebookEventsUpdateComponent
} from './facebook/components';

import {
  AttendancePastComponent,
  AttendanceUpcomingComponent,
  EventsFeedbackModalComponent,
  EventsPastActionBoxComponent
} from './attendance/components';

import {
  EventsExcelModalComponent,
  EventsImportTopBarComponent,
  EventsImportActionDropdownComponent
} from './excel/components';

import { EventsComponent } from './list/base/events.component';

@NgModule({
  declarations: [ EventsListComponent, EventsCreateComponent, EventsAttendanceComponent,
  EventsDeleteComponent, EventsInfoComponent, EventsEditComponent, EventsExcelModalComponent,
  EventsFacebookComponent, EventsExcelComponent, EventsImportActionDropdownComponent,
  EventsImportTopBarComponent, ListActionBoxComponent, ListPastComponent, ListUpcomingComponent,
  AttendancePastComponent, AttendanceUpcomingComponent,
  EventsFeedbackModalComponent, EventsPastActionBoxComponent, FacebookEventsCreateComponent,
  FacebookEventsUpdateComponent, FacebookEventsDeleteComponent, EventsComponent ],

  imports: [ CommonModule, SharedModule, EventsRoutingModule, RouterModule, ReactiveFormsModule ],

  providers: [ EventsService ],

  exports: [ EventsListComponent, EventsCreateComponent, EventsAttendanceComponent,
  EventsDeleteComponent, EventsInfoComponent, EventsEditComponent, EventsExcelModalComponent,
  EventsFacebookComponent, EventsExcelComponent, EventsImportActionDropdownComponent,
  EventsImportTopBarComponent, ListActionBoxComponent, ListPastComponent, ListUpcomingComponent,
  AttendancePastComponent, AttendanceUpcomingComponent,
  EventsFeedbackModalComponent, EventsPastActionBoxComponent, EventsComponent]
})
export class EventsModule {}
