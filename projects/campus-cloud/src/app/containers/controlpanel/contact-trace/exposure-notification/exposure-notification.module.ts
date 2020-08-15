import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExposureNotificationListComponent, ExposureNotificationRoutingModule } from '.';
import { SharedModule } from '@campus-cloud/shared/shared.module';

@NgModule({
  declarations: [ExposureNotificationListComponent],
  imports: [CommonModule, SharedModule, ExposureNotificationRoutingModule]
})
export class ExposureNotificationModule {}
