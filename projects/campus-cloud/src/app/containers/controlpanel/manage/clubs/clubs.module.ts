import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClubsEditComponent } from './edit';
import { ClubsListComponent } from './list';
import { ClubsExcelComponent } from './excel';
import { ClubsService } from './clubs.service';
import { ClubsCreateComponent } from './create';
import { ClubsDeleteComponent } from './delete';
import { FeedsModule } from '../feeds/feeds.module';
import { EventsModule } from '../events/events.module';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { ClubsUtilsService } from './clubs.utils.service';
import { ClubsRoutingModule } from './clubs.routing.module';
import { ModalService } from '@campus-cloud/shared/services';
import { ClubsExcelModalComponent } from './excel/components';
import { ClubsListActionBoxComponent } from './list/components';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';

import {
  ClubsFormComponent,
  ClubsSjsuFormComponent,
  ClubsContactDetailsForm
} from '@controlpanel/manage/clubs/components';

@NgModule({
  entryComponents: [ClubsDeleteComponent],
  declarations: [
    ClubsEditComponent,
    ClubsListComponent,
    ClubsFormComponent,
    ClubsExcelComponent,
    ClubsCreateComponent,
    ClubsDeleteComponent,
    ClubsSjsuFormComponent,
    ClubsContactDetailsForm,
    ClubsExcelModalComponent,
    ClubsListActionBoxComponent
  ],

  imports: [
    ImageModule.forRoot(),
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
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

  providers: [ClubsService, ModalService, ClubsUtilsService, CPI18nPipe]
})
export class ClubsModule {}
