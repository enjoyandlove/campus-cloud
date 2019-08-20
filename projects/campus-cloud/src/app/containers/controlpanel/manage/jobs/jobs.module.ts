import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { JobsService } from './jobs.service';
import { JobsUtilsService } from './jobs.utils.service';
import { JobsRoutingModule } from './jobs.routing.module';
import { EmployerModule } from './employers/employer.module';
import { SharedModule } from '../../../../shared/shared.module';

import { JobsListComponent } from './list';
import { JobsInfoComponent } from './info';
import { JobsEditComponent } from './edit';
import { JobsDeleteComponent } from './delete';
import { JobsCreateComponent } from './create';
import { JobsListActionBoxComponent } from './list/components/action-box';
import { ImageService, ImageValidatorService } from '@campus-cloud/shared/services';

import {
  JobsFormComponent,
  JobsCardComponent,
  EmployerCardComponent,
  EmployerSelectorComponent
} from './components';

@NgModule({
  declarations: [
    JobsListComponent,
    JobsFormComponent,
    JobsInfoComponent,
    JobsEditComponent,
    JobsCardComponent,
    JobsDeleteComponent,
    JobsCreateComponent,
    EmployerCardComponent,
    EmployerSelectorComponent,
    JobsListActionBoxComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    JobsRoutingModule,
    ReactiveFormsModule,
    EmployerModule
  ],
  providers: [JobsService, JobsUtilsService, ImageService, ImageValidatorService]
})
export class JobsModule {}
