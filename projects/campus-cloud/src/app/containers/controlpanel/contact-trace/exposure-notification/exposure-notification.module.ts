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
import { CasesService } from '@controlpanel/contact-trace/cases/cases.service';
import { EffectsModule } from '@ngrx/effects';
import { effects, reducers } from '@controlpanel/contact-trace/cases/store';
import { StoreModule } from '@ngrx/store';
import { CasesUtilsService } from '@controlpanel/contact-trace/cases/cases.utils.service';
import { ImportUserListComponent } from '@controlpanel/contact-trace/exposure-notification/components/import-download/import-user-list.component';

@NgModule({
  declarations: [
    ExposureNotificationListComponent,
    ExposureNotificationViewMessageComponent,
    ExposureNotificationDeleteComponent,
    ExposureNotificationToDisplayComponent,
    ExposureNotificationListActionBoxComponent,
    ExposureNotificationEditComponent,
    ExposureNotificationUserListModalComponent,
    ImportUserListComponent
  ],
  entryComponents: [ExposureNotificationDeleteComponent, ImportUserListComponent],
  imports: [
    CommonModule,
    ExposureNotificationRoutingModule,
    SharedModule,
    LayoutsModule,
    AnnouncementsModule,
    FormsModule,
    ReactiveFormsModule,
    AudienceSharedModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('casesModule', reducers)
  ],
  providers: [CPI18nPipe, CasesService, CasesUtilsService]
})
export class ExposureNotificationModule {}
