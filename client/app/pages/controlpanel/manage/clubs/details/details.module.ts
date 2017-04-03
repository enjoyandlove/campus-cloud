import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ClubsInfoComponent } from '../info';
import { ClubsWallComponent } from '../wall';
import { ClubsEditComponent } from '../edit';
import { ClubsEventsComponent } from '../events';
import { ClubsMembersComponent } from '../members';

import { ClubsDetailsComponent } from './details.component';

import { SharedModule } from '../../../../../shared/shared.module';
import { ClubsDetailsRoutingModule } from './details.routing.module';

/**
 * External Modules
 */
import { FeedsModule } from '../../feeds/feeds.module';
import { EventsModule } from '../../events/events.module';

import { ClubsService } from '../clubs.service';

@NgModule({
  declarations: [ ClubsWallComponent, ClubsEventsComponent, ClubsInfoComponent,
  ClubsMembersComponent, ClubsDetailsComponent, ClubsEditComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule,
  ClubsDetailsRoutingModule,
  FeedsModule, EventsModule ],

  providers: [ ClubsService ],
})
export class ClubsDetailsModule {}
