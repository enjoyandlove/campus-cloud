import { ButtonModule, TooltipModule } from '@ready-education/ready-ui';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { EventsEditComponent } from './edit';
import { EventsListComponent } from './list';
import { EventsInfoComponent } from './info';
import { EventsExcelComponent } from './excel';
import { EventsCreateComponent } from './create';
import { EventsDeleteComponent } from './delete';
import { EventsService } from './events.service';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { EventsAttendanceComponent } from './attendance';
import { EventUtilService } from './events.utils.service';
import { AssessModule } from '../../assess/assess.module';
import { ModalService } from '@campus-cloud/shared/services';
import { EventsRoutingModule } from './events.routing.module';
import { EventsComponent } from './list/base/events.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { CheckInModule } from './attendance/check-in/check-in.module';
import { EventsAttendanceActionBoxComponent } from './attendance/components';
import { EngagementModule } from '../../assess/engagement/engagement.module';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';
import { EngagementStudentsModule } from '../../assess/students/students.module';
import { OrientationEventsService } from '../orientation/events/orientation.events.service';
import { CommonIntegrationsModule } from '@campus-cloud/libs/integrations/common/common-integrations.module';

import { EventsFormComponent, EventsAssessmentFormComponent } from './components';

import {
  ListPastComponent,
  ListUpcomingComponent,
  ListActionBoxComponent
} from './list/components';

import {
  EventsExcelModalComponent,
  EventsImportTopBarComponent,
  EventsImportActionDropdownComponent
} from './excel/components';

@NgModule({
  entryComponents: [EventsDeleteComponent],

  declarations: [
    EventsComponent,
    ListPastComponent,
    EventsListComponent,
    EventsFormComponent,
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
    EventsAssessmentFormComponent,
    EventsAttendanceActionBoxComponent,
    EventsImportActionDropdownComponent
  ],

  imports: [
    TooltipModule,
    RouterModule,
    CommonModule,
    SharedModule,
    CheckInModule,
    LayoutsModule,
    ButtonModule,
    ImageModule.forRoot(),
    EventsRoutingModule,
    ReactiveFormsModule,
    CommonIntegrationsModule,
    EngagementStudentsModule,
    AssessModule, // sorting based on route loading
    EngagementModule
  ],

  providers: [ModalService, EventsService, EventUtilService, OrientationEventsService, CPI18nPipe],

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
