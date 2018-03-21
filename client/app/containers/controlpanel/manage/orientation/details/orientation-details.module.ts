import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { OrientationInfoComponent } from '../info';
import { OrientationProgramEditComponent } from '../edit';
import { OrientationDetailsComponent } from './orientation-details.component';

// import { TodosModule } from '../todos/todos.module';
import { SharedModule } from '../../../../../shared/shared.module';
import { OrientationDetailsRoutingModule } from './orientation-details.routing.module';

/**
 * External Modules
 */
import { FeedsModule } from '../../feeds/feeds.module';
import { EventsModule } from '../../events/events.module';
import { CalendarsModule } from '../../calendars/calendars.module';
import { OrientationService } from '../orientation.services';
import { TodosService } from '../todos/todos.service';

@NgModule({
  declarations: [
    OrientationInfoComponent,
    OrientationDetailsComponent,
    OrientationProgramEditComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    // TodosModule,
    ReactiveFormsModule,
    OrientationDetailsRoutingModule,
    FeedsModule,
    EventsModule,
    CalendarsModule,
  ],

  providers: [OrientationService, TodosService],
})
export class OrientationDetailsModule {}
