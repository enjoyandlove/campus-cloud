import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { OrientationService } from './orientation.services';
import { OrientationRoutingModule } from './orientation.routing.module';

import { OrientationListComponent } from './list';
import { OrientationProgramCreateComponent } from './create';
import { OrientationProgramDeleteComponent } from './delete';
import { OrientationDuplicateProgramComponent } from './duplicate';
import { OrientationProgramFormComponent } from './components/program-form';
import { OrientationListActionBoxComponent } from './list/components/action-box';

import { CalendarsModule } from '../calendars/calendars.module';

@NgModule({
  declarations: [
    OrientationListComponent,
    OrientationProgramFormComponent,
    OrientationListActionBoxComponent,
    OrientationProgramCreateComponent,
    OrientationProgramDeleteComponent,
    OrientationDuplicateProgramComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    OrientationRoutingModule,
    CalendarsModule
  ],

  providers: [OrientationService]
})

export class OrientationModule {}
