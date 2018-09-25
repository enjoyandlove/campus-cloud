import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  StudentsProfileHeaderComponent,
  StudentsProfileTopBarComponent
} from './profile/components';

import { SharedModule } from '../../../../shared/shared.module';
import { StudentsRoutingModule } from './students.routing.module';

import { StudentsService } from './students.service';
import { PersonasUtilsService } from './../../customise/personas/personas.utils.service';

import { StudentsListComponent } from './list';
import { StudentsProfileComponent } from './profile';
import { StudentsTopBarComponent } from './list/components';
import { StudentsComposeComponent } from './compose/students-compose.component';

@NgModule({
  declarations: [
    StudentsListComponent,
    StudentsTopBarComponent,
    StudentsComposeComponent,
    StudentsProfileComponent,
    StudentsProfileHeaderComponent,
    StudentsProfileTopBarComponent
  ],

  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    StudentsRoutingModule
  ],

  providers: [
    StudentsService,
    PersonasUtilsService
  ],

  exports: [
    StudentsComposeComponent
  ]
})
export class EngagementStudentsModule {}
