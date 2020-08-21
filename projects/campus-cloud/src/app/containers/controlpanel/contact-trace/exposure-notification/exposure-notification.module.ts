import { NgModule } from '@angular/core';

import {
  ExposureNotificationDeleteComponent,
  ExposureNotificationEditComponent,
  ExposureNotificationRoutingModule,
  ExposureNotificationUserListModalComponent,
  ExposureNotificationViewMessageComponent
} from '.';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { CommonModule } from '@angular/common';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import {
  ExposureNotificationListActionBoxComponent,
  ExposureNotificationListComponent,
  ExposureNotificationToDisplayComponent
} from '@controlpanel/contact-trace/exposure-notification/list';
import { AnnouncementsModule } from '@controlpanel/notify/announcements/announcements.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AudienceSharedModule } from '@controlpanel/audience/shared/audience.shared.module';

@NgModule({
  declarations: [
    ExposureNotificationListComponent,
    ExposureNotificationViewMessageComponent,
    ExposureNotificationDeleteComponent,
    ExposureNotificationToDisplayComponent,
    ExposureNotificationListActionBoxComponent,
    ExposureNotificationEditComponent,
    ExposureNotificationUserListModalComponent
  ],
  imports: [
    CommonModule,
    ExposureNotificationRoutingModule,
    SharedModule,
    LayoutsModule,
    AnnouncementsModule,
    FormsModule,
    ReactiveFormsModule,
    AudienceSharedModule
  ],
  providers: [CPI18nPipe]
})
export class ExposureNotificationModule {}
