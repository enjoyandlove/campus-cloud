import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ServicesEditComponent } from './edit';
import { ServicesListComponent } from './list';
import { ServicesInfoComponent } from './info';
import { ServicesExcelComponent } from './excel';
import { ServicesDeleteComponent } from './delete';
import { ServicesCreateComponent } from './create';
import { ServicesService } from './services.service';
import { ProvidersService } from './providers.service';
import { ServicesResolver } from './services.resolver';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { AssessModule } from '../../assess/assess.module';
import { ServicesAttendanceComponent } from './attendance';
import { SharedModule } from '../../../../shared/shared.module';
import { ServicesUtilsService } from './services.utils.service';
import { ServicesRoutingModule } from './services.routing.module';
import { ProvidersUtilsService } from './providers.utils.service';
import { ServicesListActionBoxComponent } from './list/components';
import { ServicesFeedsModule } from './feeds/services-feeds.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { ServicesEventsModule } from './events/services-events.module';
import { ServicesMembersModule } from './members/services-members.module';
import { ModalService, AdminService } from '@campus-cloud/shared/services';
import { EngagementModule } from '../../assess/engagement/engagement.module';
import { CheckInModule } from '../events/attendance/check-in/check-in.module';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';
import { ServicesExcelModalComponent, ServicesImportTopBarComponent } from './excel/components';

import {
  ServicesProviderAddComponent,
  ServiceProvidersEditComponent,
  ServicesProvidersFormComponent,
  ServicesProviderStatsComponent,
  ServicesProvidersListComponent,
  ServicesProviderDeleteComponent,
  ServicesProviderDetailsComponent,
  ServicesProviderActionBoxComponent
} from './attendance/components';

import {
  ServicesProvidersCheckInEditComponent,
  ServicesProvidersCheckInCreateComponent,
  ServicesProvidersCheckInDeleteComponent
} from './attendance/components/providers-details/check-in';

import {
  ServicesProvidersAttendeesListComponent,
  ServicesProvidersAttendeesStatsComponent,
  ServicesProvidersAttendeesActionBoxComponent
} from './attendance/components/providers-details/components';

@NgModule({
  entryComponents: [ServicesDeleteComponent],
  declarations: [
    ServicesEditComponent,
    ServicesInfoComponent,
    ServicesListComponent,
    ServicesExcelComponent,
    ServicesCreateComponent,
    ServicesDeleteComponent,
    ServicesExcelModalComponent,
    ServicesAttendanceComponent,
    ServicesProviderAddComponent,
    ServicesImportTopBarComponent,
    ServiceProvidersEditComponent,
    ServicesProvidersFormComponent,
    ServicesProvidersListComponent,
    ServicesProviderStatsComponent,
    ServicesListActionBoxComponent,
    ServicesProviderDeleteComponent,
    ServicesProviderDetailsComponent,
    ServicesProviderActionBoxComponent,
    ServicesProvidersCheckInEditComponent,
    ServicesProvidersAttendeesListComponent,
    ServicesProvidersCheckInDeleteComponent,
    ServicesProvidersCheckInCreateComponent,
    ServicesProvidersAttendeesStatsComponent,
    ServicesProvidersAttendeesActionBoxComponent
  ],

  imports: [
    ImageModule.forRoot(),
    ServicesRoutingModule,
    CommonModule,
    SharedModule,
    RouterModule,
    CheckInModule,
    LayoutsModule,
    ReactiveFormsModule,
    ServicesFeedsModule,
    ServicesEventsModule,
    ServicesMembersModule,
    AssessModule, // sorting based on route loading
    EngagementModule
  ],

  providers: [
    CPI18nPipe,
    AdminService,
    ModalService,
    ServicesService,
    ProvidersService,
    ServicesResolver,
    ServicesUtilsService,
    ProvidersUtilsService
  ]
})
export class ServicesModule {}
