import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

/**
 * CRUD
 */
import { ClubsListComponent } from './list';
import { ClubsCreateComponent } from './create';
import { ClubsDeleteComponent } from './delete';

import { ClubsExcelComponent } from './excel';

import {
  ClubsListActionBoxComponent
} from './list/components';

import {
  ClubsExcelModalComponent
} from './excel/components';

/**
 * External Modules
 */
import { FeedsModule } from '../feeds/feeds.module';
import { EventsModule } from '../events/events.module';

import { ClubsService } from './clubs.service';
import { ClubsRoutingModule } from './clubs.routing.module';

@NgModule({
  declarations: [ ClubsListComponent, ClubsCreateComponent,
  ClubsDeleteComponent, ClubsListActionBoxComponent, ClubsExcelModalComponent,
  ClubsExcelComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule, ClubsRoutingModule,
  FeedsModule, EventsModule ],

  providers: [ ClubsService ],
})
export class ClubsModule {}
