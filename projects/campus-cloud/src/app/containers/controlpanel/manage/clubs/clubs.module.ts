import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClubsEditComponent } from './edit';
import { ClubsListComponent } from './list';
import { ClubsExcelComponent } from './excel';
import { ClubsService } from './clubs.service';
import { ModalService } from '@campus-cloud/shared/services';
import { ClubsCreateComponent } from './create';
import { ClubsDeleteComponent } from './delete';
import { FeedsModule } from '../feeds/feeds.module';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { EventsModule } from '../events/events.module';
import { ClubsUtilsService } from './clubs.utils.service';
import { ClubsRoutingModule } from './clubs.routing.module';
import { ClubsExcelModalComponent } from './excel/components';
import { ClubsListActionBoxComponent } from './list/components';

@NgModule({
  entryComponents: [ClubsDeleteComponent],
  declarations: [
    ClubsEditComponent,
    ClubsListComponent,
    ClubsExcelComponent,
    ClubsCreateComponent,
    ClubsDeleteComponent,
    ClubsExcelModalComponent,
    ClubsListActionBoxComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    ClubsRoutingModule,
    FeedsModule,
    EventsModule
  ],

  exports: [
    ClubsEditComponent,
    ClubsListComponent,
    ClubsExcelComponent,
    ClubsExcelComponent,
    ClubsCreateComponent,
    ClubsDeleteComponent,
    ClubsExcelModalComponent,
    ClubsListActionBoxComponent
  ],

  providers: [ClubsService, ModalService, ClubsUtilsService]
})
export class ClubsModule {}
