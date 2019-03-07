import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalService } from '@shared/services';
import { OrientationListComponent } from './list';
import { ClubsModule } from '../clubs/clubs.module';
import { SharedModule } from '@shared/shared.module';
import { OrientationService } from './orientation.services';
import { OrientationProgramCreateComponent } from './create';
import { OrientationProgramDeleteComponent } from './delete';
import { CalendarsModule } from '../calendars/calendars.module';
import { OrientationDuplicateProgramComponent } from './duplicate';
import { OrientationUtilsService } from './orientation.utils.service';
import { OrientationRoutingModule } from './orientation.routing.module';
import { OrientationListActionBoxComponent } from './list/components/action-box';

@NgModule({
  entryComponents: [OrientationProgramDeleteComponent],
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

  providers: [OrientationService, ModalService, OrientationUtilsService]
})
export class OrientationModule {}
