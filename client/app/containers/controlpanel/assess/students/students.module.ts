import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { EngagementStudentsListComponent } from './list';

import {
  StudentsTopBarComponent
} from './list/components';

import { StudentsComposeComponent } from './compose/students-compose.component';

import { StudentsService } from './students.service';

import { EngagementStudentsRoutingModule } from './students.routing.module';

@NgModule({
  declarations: [ EngagementStudentsListComponent, StudentsTopBarComponent,
    StudentsComposeComponent ],

  imports: [ ReactiveFormsModule, CommonModule, SharedModule, EngagementStudentsRoutingModule ],

  providers: [ StudentsService ],
})
export class EngagementStudentsModule {}
