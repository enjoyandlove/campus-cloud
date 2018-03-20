import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { OrientationInfoComponent } from '../info';
import { OrientationWallComponent } from '../wall';
import { OrientationProgramEditComponent } from '../edit';
import { OrientationDetailsComponent } from './orientation-details.component';

import { SharedModule } from '../../../../../shared/shared.module';
import { OrientationDetailsRoutingModule } from './orientation-details.routing.module';

/**
 * External Modules
 */
import { FeedsModule } from '../../feeds/feeds.module';
import { EventsModule } from '../../events/events.module';
import { CalendarsModule } from '../../calendars/calendars.module';
import { OrientationService } from '../orientation.services';

@NgModule({
  declarations: [
    OrientationInfoComponent,
    OrientationWallComponent,
    OrientationDetailsComponent,
    OrientationProgramEditComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    OrientationDetailsRoutingModule,
    FeedsModule,
    EventsModule,
    CalendarsModule,
  ],

  providers: [OrientationService],
})
export class OrientationDetailsModule {}
