import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { ServicesEditComponent } from './edit';
import { ServicesListComponent } from './list';
import { ServicesInfoComponent } from './info';
import { ServicesEventsComponent } from './events';
import { ServicesDeleteComponent } from './delete';
import { ServicesCreateComponent } from './create';
import { ServicesAttendanceComponent } from './attendance';

import { ServicesService } from './services.service';
import { ServicesRoutingModule } from './services.routing.module';

import {
  ServicesListActionBoxComponent
} from './list/components';

import {
  ServicesExcelModalComponent
} from './excel/components';

import {
  ServicesDeleteAdminModalComponent,
} from './create/components';

import {
  ServicesProviderAddComponent,
  ServicesProviderDeleteComponent
} from './attendance/components';


@NgModule({
  declarations: [ ServicesListComponent, ServicesListActionBoxComponent, ServicesDeleteComponent,
  ServicesExcelModalComponent, ServicesAttendanceComponent, ServicesCreateComponent,
  ServicesDeleteAdminModalComponent, ServicesEditComponent, ServicesInfoComponent,
  ServicesEventsComponent, ServicesProviderAddComponent, ServicesProviderDeleteComponent ],

  imports: [ CommonModule, SharedModule, ServicesRoutingModule, RouterModule, ReactiveFormsModule ],

  providers: [ ServicesService ],
})
export class ServicesModule {}
