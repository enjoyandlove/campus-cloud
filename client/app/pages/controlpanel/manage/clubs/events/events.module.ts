import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';

import { ClubsEventsComponent } from './clubs-events.component';

/**
 * External Modules
 */
import { EventsModule } from '../../events/events.module';
import { ClubsEventsRoutingModule } from './events.routing.module';

@NgModule({
  declarations: [ ClubsEventsComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule,
  ClubsEventsRoutingModule, EventsModule ],

  providers: [ ],
})
export class ClubsEventsModule {}
