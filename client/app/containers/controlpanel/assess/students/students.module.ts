import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import {
  StudentsProfileTopBarComponent,
  StudentsProfileHeaderComponent
} from './profile/components';

import { StudentsListComponent } from './list';
import { StudentsProfileComponent } from './profile';
import { StudentsTopBarComponent } from './list/components';
import { StudentsComposeComponent } from './compose/students-compose.component';

import { StudentsService } from './students.service';
import { StudentsRoutingModule } from './students.routing.module';

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
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    StudentsRoutingModule
  ],

  providers: [StudentsService],

  exports: [StudentsComposeComponent]
})
export class EngagementStudentsModule {}
