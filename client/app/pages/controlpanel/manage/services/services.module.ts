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
  ServicesEventsCreateComponent,
  ServicesEventsAttendanceComponent
} from './events/components';

import {
  ServicesListActionBoxComponent
} from './list/components';

import {
  ServicesExcelModalComponent,
  ServicesImportTopBarComponent
} from './excel/components';

import {
  ServicesDeleteAdminModalComponent,
} from './create/components';

import {
  ServicesProviderAddComponent,
  ServicesProvidersListComponent,
  ServicesProviderDeleteComponent,
  ServicesProviderDetailsComponent
} from './attendance/components';

import {
  ServicesProvidersAttendeesListComponent
} from './attendance/components/providers-details/components';

import { EventsModule } from '../events/events.module';


@NgModule({
  declarations: [ ServicesListComponent, ServicesListActionBoxComponent, ServicesDeleteComponent,
  ServicesExcelModalComponent, ServicesAttendanceComponent, ServicesCreateComponent,
  ServicesDeleteAdminModalComponent, ServicesEditComponent, ServicesInfoComponent,
  ServicesEventsComponent, ServicesProviderAddComponent, ServicesProviderDeleteComponent,
  ServicesExcelComponent, ServicesImportTopBarComponent, ServicesProvidersListComponent,
  ServicesProviderDetailsComponent, ServicesProvidersAttendeesListComponent,
  ServicesEventsCreateComponent, ServicesEventsAttendanceComponent, ServicesEventsInfoComponent,
  ServicesEventsEditComponent ],

  imports: [ CommonModule, SharedModule, ServicesRoutingModule, RouterModule,
  ReactiveFormsModule, EventsModule ],

  providers: [ ServicesService, ProvidersService, AdminService ],
})
export class ServicesModule {}
