import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CalendarsListComponent } from './list';
import { CalendarsEditComponent } from './edit';
import { CalendarsCreateComponent } from './create';
import { CalendarsDeleteComponent } from './delete';
import { CalendarsDetailComponent } from './details';
import { CalendarsService } from './calendars.services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CalendarRoutingModule } from './calendars.routing.module';
import { CalendarsItemsService } from './items/item.utils.service';
import { CalendarsListActionBoxComponent } from './list/components';
import { CalendarsFormComponent } from './components/calendar-form';
import { CalendarsItemsImportConfirmationComponent } from './items/components';
import { CalendarsItemCreateComponent } from './items/create/calendars-items-create.component';
import { CalendarsDetailsActionBoxComponent } from './details/components/action-box/calendars-details-action-box.component';

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
