/* tslint:disable:max-line-length */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { ServicesEditComponent } from './edit';
import { ServicesListComponent } from './list';
import { ServicesInfoComponent } from './info';
import { ServicesExcelComponent } from './excel';
import { ServicesEventsComponent } from './events';
import { ServicesDeleteComponent } from './delete';
import { ServicesCreateComponent } from './create';
import { ServicesAttendanceComponent } from './attendance';

import { ServicesService } from './services.service';
import { ProvidersService } from './providers.service';
import { AdminService } from '../../../../shared/services/admin.service';

import { ServicesRoutingModule } from './services.routing.module';

import {
  ServicesEventsEditComponent,
  ServicesEventsInfoComponent,
  ServicesEventsExcelComponent,
  ServicesEventsCreateComponent,
  ServicesEventsAttendanceComponent
} from './events/components';

import { ServicesListActionBoxComponent } from './list/components';

import { ServicesExcelModalComponent, ServicesImportTopBarComponent } from './excel/components';

import {
  ServicesProvidersCheckInEditComponent,
  ServicesProvidersCheckInCreateComponent,
  ServicesProvidersCheckInDeleteComponent
} from './attendance/components/providers-details/check-in';

import {
  ServicesProviderAddComponent,
  ServicesProviderStatsComponent,
  ServicesProvidersListComponent,
  ServicesProviderDeleteComponent,
  ServicesProviderDetailsComponent,
  ServicesProviderActionBoxComponent
} from './attendance/components';

import {
  ServicesProvidersAttendeesListComponent,
  ServicesProvidersAttendeesStatsComponent,
  ServicesProvidersAttendeesActionBoxComponent,
} from './attendance/components/providers-details/components';

import { EventsModule } from '../events/events.module';
import { ServicesUtilsService } from './services.utils.service';
import { CheckInModule } from '../events/attendance/check-in/check-in.module';

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
    ServicesEventsComponent,
    ServicesProviderAddComponent,
    ServicesProviderDeleteComponent,
    ServicesExcelComponent,
    ServicesImportTopBarComponent,
    ServicesProvidersListComponent,
    ServicesProviderDetailsComponent,
    ServicesProvidersAttendeesListComponent,
    ServicesEventsCreateComponent,
    ServicesEventsAttendanceComponent,
    ServicesEventsInfoComponent,
    ServicesEventsEditComponent,
    ServicesEventsExcelComponent,
    ServicesProvidersAttendeesStatsComponent,
    ServicesProvidersAttendeesActionBoxComponent,
    ServicesProvidersCheckInCreateComponent,
    ServicesProvidersCheckInEditComponent,
    ServicesProvidersCheckInDeleteComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    ServicesRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    CheckInModule,
    EventsModule
  ],

  providers: [ServicesService, ProvidersService, AdminService, ServicesUtilsService]
})
export class ServicesModule {}
