import { NgModule } from '@angular/core';

import {
  ExposureNotificationDeleteComponent,
  ExposureNotificationRoutingModule,
  ExposureNotificationViewMessageComponent
} from '.';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { CommonModule } from '@angular/common';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import {
  ExposureNotificationListComponent,
  ExposureNotificationToDisplayComponent
} from '@controlpanel/contact-trace/exposure-notification/list';

@NgModule({
  declarations: [
    ExposureNotificationListComponent,
    ExposureNotificationViewMessageComponent,
    ExposureNotificationDeleteComponent,
    ExposureNotificationToDisplayComponent
  ],
  imports: [CommonModule, ExposureNotificationRoutingModule, SharedModule, LayoutsModule],
  providers: [CPI18nPipe]
})
export class ExposureNotificationModule {}
