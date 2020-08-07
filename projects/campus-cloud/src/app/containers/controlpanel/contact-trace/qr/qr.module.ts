import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { QrComponent } from './qr.component';
import { QrListComponent } from './list';
import { QrListActionBoxComponent, QrListNoContentComponent } from './list/components';
import { QrExcelModalComponent } from './excel/components';
import { QrExcelComponent } from './excel';
import { QrCreateComponent } from './create';
import { QrDeleteComponent } from './delete';
import { QrEditComponent } from './edit';
import { QrFormComponent } from './form';
import { QrDetailsComponent } from './details';
import {
  QrCheckInCreateComponent,
  QrCheckInDeleteComponent,
  QrCheckInEditComponent
} from './details/check-in';
import { QrAttendeesActionBoxComponent, QrAttendeesListComponent } from './details/components';

import { ModalService, AdminService } from '@campus-cloud/shared/services';
import { ProvidersService } from '../../manage/services/providers.service';
import { ServicesService } from '../../manage/services/services.service';
import { ServicesUtilsService } from '../../manage/services/services.utils.service';
import { ProvidersUtilsService } from '../../manage/services/providers.utils.service';
import { EventUtilService } from '../../manage/events/events.utils.service';

import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { EngagementModule } from '../../assess/engagement/engagement.module';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';
import { SharedModule } from '../../../../shared/shared.module';
import { QrRoutingModule } from './qr.routing.module';
import { CheckInModule } from '../../manage/events/attendance/check-in/check-in.module';
@NgModule({
  declarations: [
    QrComponent,
    QrListComponent,
    QrListActionBoxComponent,
    QrListNoContentComponent,
    QrExcelModalComponent,
    QrExcelComponent,
    QrCreateComponent,
    QrDeleteComponent,
    QrEditComponent,
    QrFormComponent,
    QrDetailsComponent,
    QrCheckInCreateComponent,
    QrCheckInDeleteComponent,
    QrCheckInEditComponent,
    QrAttendeesActionBoxComponent,
    QrAttendeesListComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    CheckInModule,
    QrRoutingModule,
    ReactiveFormsModule,
    EngagementModule,
    ImageModule.forRoot()
  ],

  providers: [
    CPI18nPipe,
    AdminService,
    ModalService,
    ProvidersService,
    ServicesService,
    ProvidersUtilsService,
    ServicesUtilsService,
    EventUtilService
  ]
})
export class QrModule {}
