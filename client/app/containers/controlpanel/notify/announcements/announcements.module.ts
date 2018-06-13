import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { AnnouncementsListComponent } from './list';
import { AnnouncementDeleteComponent } from './delete';
import { AnnouncementsConfirmComponent } from './confirm';
import { AnnouncementsComposeComponent } from './compose';

import { AudienceModule } from './../../audience/audience.module';

import { AudienceSharedModule } from './../../audience/shared/audience.shared.module';

import {
  AnnouncementsListActionBoxComponent,
  AnnouncementsListRecipientsComponent
} from './list/components';

import { AnnouncementsRoutingModule } from './announcements.routing.module';

import { AnnouncementsService } from './announcements.service';

@NgModule({
  declarations: [
    AnnouncementsListComponent,
    AnnouncementsListActionBoxComponent,
    AnnouncementsComposeComponent,
    AnnouncementsConfirmComponent,
    AnnouncementDeleteComponent,
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
    AudienceModule,
    ReactiveFormsModule
  ],

  providers: [AnnouncementsService]
})
export class AnnouncementsModule {}
