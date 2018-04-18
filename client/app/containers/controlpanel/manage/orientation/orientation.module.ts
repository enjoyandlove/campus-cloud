import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { OrientationService } from './orientation.services';
import { OrientationUtilsService } from './orientation.utils.service';
import { OrientationRoutingModule } from './orientation.routing.module';

import { OrientationListComponent } from './list';
import { OrientationProgramCreateComponent } from './create';
import { OrientationProgramDeleteComponent } from './delete';
import { OrientationDuplicateProgramComponent } from './duplicate';
import { OrientationListActionBoxComponent } from './list/components/action-box';

import { CalendarsModule } from '../calendars/calendars.module';
import { ClubsModule } from '../clubs/clubs.module';

@NgModule({
  declarations: [
    OrientationListComponent,
    OrientationListActionBoxComponent,
    OrientationProgramCreateComponent,
    OrientationProgramDeleteComponent,
    OrientationDuplicateProgramComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    OrientationRoutingModule,
    CalendarsModule,
    ClubsModule
  ],

  providers: [OrientationService, OrientationUtilsService]
})
export class OrientationModule {}
