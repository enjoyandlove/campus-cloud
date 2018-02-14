import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';
import { EventsModule } from '../events/events.module';
import { FeedsModule } from '../feeds/feeds.module';

import { ClubsRoutingModule } from './clubs.routing.module';
import { ClubsService } from './clubs.service';
import { ClubsUtilsService } from './clubs.utils.service';
import { ClubsCreateComponent } from './create';
import { ClubsDeleteComponent } from './delete';
import { ClubsEditComponent } from './edit';
import { ClubsExcelComponent } from './excel';
import { ClubsExcelModalComponent } from './excel/components';
import { ClubsListComponent } from './list';
import { ClubsListActionBoxComponent } from './list/components';

/**
 * CRUD
 */

/**
 * External Modules
 */

@NgModule({
  declarations: [
    ClubsListComponent,
    ClubsCreateComponent,
    ClubsDeleteComponent,
    ClubsListActionBoxComponent,
    ClubsExcelModalComponent,
    ClubsExcelComponent,
    ClubsEditComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    ClubsRoutingModule,
    FeedsModule,
    EventsModule,
  ],

  exports: [
    ClubsListComponent,
    ClubsCreateComponent,
    ClubsDeleteComponent,
    ClubsListActionBoxComponent,
    ClubsExcelModalComponent,
    ClubsExcelComponent,
    ClubsEditComponent,
  ],

  providers: [ClubsService, ClubsUtilsService],
})
export class ClubsModule {}
