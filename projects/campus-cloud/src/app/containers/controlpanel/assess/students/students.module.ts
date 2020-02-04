import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  StudentsProfileHeaderComponent,
  StudentsProfileTopBarComponent
} from './profile/components';
import { StudentsListComponent } from './list';
import { StudentsProfileComponent } from './profile';
import { StudentsService } from './students.service';
import { UserService } from '@campus-cloud/shared/services';
import { StudentsTopBarComponent } from './list/components';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { StudentsRoutingModule } from './students.routing.module';
import { StudentsComposeComponent } from './compose/students-compose.component';
import { PersonasUtilsService } from './../../customise/personas/personas.utils.service';

@NgModule({
  declarations: [
    StudentsListComponent,
    StudentsTopBarComponent,
    StudentsComposeComponent,
    StudentsProfileComponent,
    StudentsProfileHeaderComponent,
    StudentsProfileTopBarComponent
  ],

  imports: [SharedModule, CommonModule, ReactiveFormsModule, StudentsRoutingModule],

  providers: [StudentsService, PersonasUtilsService, UserService],

  exports: [StudentsComposeComponent]
})
export class EngagementStudentsModule {}
