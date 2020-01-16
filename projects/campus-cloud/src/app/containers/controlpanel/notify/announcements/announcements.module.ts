import { PopoverModule, IconsModule, ButtonModule, StackModule } from '@ready-education/ready-ui';
import { ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  AnnouncementFormComponent,
  AnnouncementsListActionBoxComponent,
  AnnouncementsDatetimePickerComponent
} from './components';

import {
  AnnouncementsListSummaryComponent,
  AnnouncementsListRecipientsComponent
} from './sent/components';

import { AnnouncementDeleteComponent } from './delete';
import { AnnouncementsConfirmComponent } from './confirm';
import { AnnouncementsComposeComponent } from './compose';
import { ModalService } from '@campus-cloud/shared/services';
import { AnnouncementScheduledComponent } from './scheduled';
import { AnnouncementsService } from './announcements.service';
import { AudienceModule } from './../../audience/audience.module';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { AnnouncementSentComponent } from './sent/sent.component';
import { AnnouncementCreateErrorComponent } from './create-error';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { ScheduledActionCellComponent } from './scheduled/components';
import { PriorityToLabelPipe, AnnouncementRecipientPipe } from './pipes';
import { AnnouncementsRoutingModule } from './announcements.routing.module';
import { ScheduledEditComponent } from './scheduled-edit/scheduled-edit.component';
import { AudienceSharedModule } from './../../audience/shared/audience.shared.module';
import { CommonIntegrationsModule } from '@campus-cloud/libs/integrations/common/common-integrations.module';

@NgModule({
  entryComponents: [
    AnnouncementDeleteComponent,
    AnnouncementsConfirmComponent,
    AnnouncementCreateErrorComponent
  ],
  declarations: [
    PriorityToLabelPipe,
    ScheduledEditComponent,
    AnnouncementFormComponent,
    AnnouncementSentComponent,
    AnnouncementRecipientPipe,
    AnnouncementDeleteComponent,
    ScheduledActionCellComponent,
    AnnouncementsComposeComponent,
    AnnouncementsConfirmComponent,
    AnnouncementScheduledComponent,
    AnnouncementCreateErrorComponent,
    AnnouncementsListSummaryComponent,
    AnnouncementsListActionBoxComponent,
    AnnouncementsListRecipientsComponent,
    AnnouncementsDatetimePickerComponent
  ],

  exports: [
    AnnouncementsComposeComponent,
    AnnouncementsConfirmComponent,
    AnnouncementsListRecipientsComponent
  ],

  imports: [
    StackModule,
    A11yModule,
    CommonModule,
    SharedModule,
    LayoutsModule,
    PopoverModule,
    IconsModule,
    ButtonModule,
    AudienceSharedModule,
    AnnouncementsRoutingModule,
    CommonIntegrationsModule,
    AudienceModule,
    ReactiveFormsModule
  ],

  providers: [ModalService, AnnouncementsService, AnnouncementRecipientPipe]
})
export class AnnouncementsModule {}
