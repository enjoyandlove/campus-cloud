import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  AnnouncementsListActionBoxComponent,
  AnnouncementsListRecipientsComponent,
  AnnouncementsListSummaryComponent
} from './list/components';

import { AnnouncementsListComponent } from './list';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { AnnouncementDeleteComponent } from './delete';
import { AnnouncementsConfirmComponent } from './confirm';
import { AnnouncementsComposeComponent } from './compose';
import { AnnouncementsService } from './announcements.service';
import { AudienceModule } from './../../audience/audience.module';
import { AnnouncementsRoutingModule } from './announcements.routing.module';
import { AudienceSharedModule } from './../../audience/shared/audience.shared.module';
import { CommonIntegrationsModule } from '@campus-cloud/libs/integrations/common/common-integrations.module';

@NgModule({
  declarations: [
    AnnouncementsListComponent,
    AnnouncementDeleteComponent,
    AnnouncementsComposeComponent,
    AnnouncementsConfirmComponent,
    AnnouncementsListSummaryComponent,
    AnnouncementsListActionBoxComponent,
    AnnouncementsListRecipientsComponent
  ],

  exports: [
    AnnouncementsComposeComponent,
    AnnouncementsConfirmComponent,
    AnnouncementsListRecipientsComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    AudienceSharedModule,
    AnnouncementsRoutingModule,
    CommonIntegrationsModule,
    AudienceModule,
    ReactiveFormsModule
  ],

  providers: [AnnouncementsService]
})
export class AnnouncementsModule {}
