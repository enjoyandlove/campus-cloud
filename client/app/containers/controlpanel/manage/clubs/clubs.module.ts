import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

/**
 * CRUD
 */
import { ClubsListComponent } from './list';
import { ClubsEditComponent } from './edit';
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
import { ClubsUtilsService } from './clubs.utils.service';
import { ClubsRoutingModule } from './clubs.routing.module';

@NgModule({
  declarations: [ ClubsListComponent, ClubsCreateComponent,
  ClubsDeleteComponent, ClubsListActionBoxComponent, ClubsExcelModalComponent,
  ClubsExcelComponent, ClubsEditComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule, ClubsRoutingModule,
  FeedsModule, EventsModule ],

  providers: [ ClubsService, ClubsUtilsService ],
})
export class ClubsModule {}
