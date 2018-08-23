import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonasUtilsService } from './../../customise/personas/personas.utils.service';
import { StudentsComposeComponent } from './compose/students-compose.component';
import { StudentsListComponent } from './list';
import { StudentsTopBarComponent } from './list/components';
import { StudentsProfileComponent } from './profile';
import {
  StudentsProfileHeaderComponent,
  StudentsProfileTopBarComponent
} from './profile/components';
import { StudentsRoutingModule } from './students.routing.module';
import { StudentsService } from './students.service';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    StudentsListComponent,
    StudentsTopBarComponent,
    StudentsComposeComponent,
    StudentsProfileComponent,
    StudentsProfileHeaderComponent,
    StudentsProfileTopBarComponent
  ],

  imports: [ReactiveFormsModule, CommonModule, SharedModule, StudentsRoutingModule],

  providers: [StudentsService, PersonasUtilsService],

  exports: [StudentsComposeComponent]
})
export class EngagementStudentsModule {}
