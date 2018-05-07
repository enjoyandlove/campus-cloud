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
import { JobsFormComponent } from './components/jobs-form';
import { JobsListActionBoxComponent } from './list/components/action-box';

@NgModule({
  declarations: [
    JobsListComponent,
    JobsFormComponent,
    JobsInfoComponent,
    JobsEditComponent,
    JobsDeleteComponent,
    JobsCreateComponent,
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
  providers: [JobsService, JobsUtilsService]
})
export class JobsModule {}
