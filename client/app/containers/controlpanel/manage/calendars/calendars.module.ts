/* tslint:disable:max-line-length */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarRoutingModule } from './calendars.routing.module';
import { CalendarsService } from './calendars.services';
import { CalendarsFormComponent } from './components/calendar-form/index';
import { CalendarsCreateComponent } from './create';
import { CalendarsDeleteComponent } from './delete';
import { CalendarsDetailComponent } from './details';
import { CalendarsDetailsActionBoxComponent } from './details/components/action-box/calendars-details-action-box.component';
import { CalendarsEditComponent } from './edit';
import { CalendarsItemCreateComponent } from './items/create/calendars-items-create.component';
import { CalendarsItemsService } from './items/item.utils.service';
import { CalendarsListComponent } from './list';
import { CalendarsListActionBoxComponent } from './list/components';
import { SharedModule } from '../../../../shared/shared.module';

import { CalendarsItemsImportConfirmationComponent } from './items/components/import-confirmation-modal/import-confirmation-modal.component';

import {
  CalendarsItemsDeleteComponent,
  CalendarsItemsDetailsComponent,
  CalendarsItemsEditComponent
} from './items';
import { CalendarsItemFormComponent, CalendarsItemsImportModalComponent } from './items/components';
import { CPLocationsService } from '../../../../shared/services/locations.service';

import { CalendarsItemsBulkCreateFormComponent } from './items/components/bulk-create-form/calendars-items-bulk-create-form.component';
import { CalendarsItemsBulkCreateComponent } from './items/bulk-create/calendats-items-bulk-create.component';

@NgModule({
  declarations: [
    CalendarsListComponent,
    CalendarsEditComponent,
    CalendarsFormComponent,
    CalendarsDeleteComponent,
    CalendarsDetailComponent,
    CalendarsItemsEditComponent,
    CalendarsItemsDeleteComponent,
    CalendarsItemCreateComponent,
    CalendarsItemFormComponent,
    CalendarsItemsImportModalComponent,
    CalendarsItemsDetailsComponent,
    CalendarsDetailsActionBoxComponent,
    CalendarsListActionBoxComponent,
    CalendarsCreateComponent,
    CalendarsItemsBulkCreateComponent,
    CalendarsItemsBulkCreateFormComponent,
    CalendarsItemsImportConfirmationComponent
  ],

  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule, CalendarRoutingModule],

  exports: [CalendarsFormComponent],

  providers: [CalendarsService, CalendarsItemsService, CPLocationsService]
})
export class CalendarsModule {}
