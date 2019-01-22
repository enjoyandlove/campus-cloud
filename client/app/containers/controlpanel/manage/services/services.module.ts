/* tslint:disable:max-line-length */
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
import { ServicesAttendanceComponent } from './attendance';
import { LayoutsModule } from '@app/layouts/layouts.module';
import { ServicesListActionBoxComponent } from './list/components';
import { ServicesExcelModalComponent, ServicesImportTopBarComponent } from './excel/components';

import { ServicesService } from './services.service';
import { ProvidersService } from './providers.service';
import { ServicesResolver } from './services.resolver';
import { SharedModule } from '../../../../shared/shared.module';
import { ServicesUtilsService } from './services.utils.service';
import { ServicesRoutingModule } from './services.routing.module';
import { ServicesFeedsModule } from './feeds/services-feeds.module';
import { ServicesEventsModule } from './events/services-events.module';
import { AdminService } from '../../../../shared/services/admin.service';
import { ServicesMembersModule } from './members/services-members.module';
import { CheckInModule } from '../events/attendance/check-in/check-in.module';

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
  declarations: [
    ServicesListComponent,
    ServicesProviderStatsComponent,
    ServicesProviderActionBoxComponent,
    ServicesListActionBoxComponent,
    ServicesDeleteComponent,
    ServicesExcelModalComponent,
    ServicesAttendanceComponent,
    ServicesCreateComponent,
    ServicesEditComponent,
    ServicesInfoComponent,
    ServicesProviderAddComponent,
    ServicesProviderDeleteComponent,
    ServicesExcelComponent,
    ServicesImportTopBarComponent,
    ServicesProvidersListComponent,
    ServicesProviderDetailsComponent,
    ServicesProvidersAttendeesListComponent,
    ServiceProvidersEditComponent,
    ServicesProvidersFormComponent,
    ServicesProvidersAttendeesStatsComponent,
    ServicesProvidersAttendeesActionBoxComponent,
    ServicesProvidersCheckInCreateComponent,
    ServicesProvidersCheckInEditComponent,
    ServicesProvidersCheckInDeleteComponent
  ],

  imports: [
    ServicesRoutingModule,
    CommonModule,
    SharedModule,
    RouterModule,
    CheckInModule,
    LayoutsModule,
    ReactiveFormsModule,
    ServicesFeedsModule,
    ServicesEventsModule,
    ServicesMembersModule
  ],

  providers: [
    AdminService,
    ServicesService,
    ProvidersService,
    ServicesResolver,
    ServicesUtilsService
  ]
})
export class ServicesModule {}
