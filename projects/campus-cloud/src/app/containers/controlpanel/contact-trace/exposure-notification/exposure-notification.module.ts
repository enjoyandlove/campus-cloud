import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExposureNotificationListComponent, ExposureNotificationRoutingModule } from '.';

@NgModule({
  declarations: [ExposureNotificationListComponent],
  imports: [CommonModule, ExposureNotificationRoutingModule]
})
export class ExposureNotificationModule {}
