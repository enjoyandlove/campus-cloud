import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CPTrackingService } from './services/tracking.service';

import { CPMapsComponent, CPModalComponent, CPTopBarComponent, CPAvatarComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent, CPPlaceAutoCompleteComponent,
  CPPageHeaderComponent, CPSearchBoxComponent, CPStarsComponent,
  CPAlertComponent, CPDatePickerComponent, CPSwitchComponent,
  CPSmallDatePickerComponent, CPUploadButtonComponent, CPPaginationComponent,
  CPNoContentComponent, CPCheckDropdownComponent, CPImageUploadComponent,
  SchoolSwitchComponent, CPTrackersComponent, CPChipComponent, CPTypeAheadComponent,
  CPUploadModalComponent, CPSnackBarComponent, CPButtonComponent, CPTextEditorComponent,
  CPTopBanerComponent
} from './components';

import {
  CPI18nPipe,
  CPDatePipe,
  CPFilterPipe
} from './pipes';

import {
  CPTrackerDirective
} from './directives';

import {
  StoreService,
  FileUploadService
} from './services';

@NgModule({
  declarations: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPUploadButtonComponent,
  CPSpinnerComponent, CPDropdownComponent,  CPCheckboxComponent,
  CPPageHeaderComponent, CPSearchBoxComponent, CPDatePipe,
  CPStarsComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPDatePickerComponent, CPSwitchComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent, CPPaginationComponent, CPNoContentComponent,
  CPCheckDropdownComponent, CPImageUploadComponent, SchoolSwitchComponent,
  CPTrackersComponent, CPUploadModalComponent, CPChipComponent, CPTypeAheadComponent,
  CPSnackBarComponent, CPTrackerDirective, CPButtonComponent, CPTextEditorComponent,
  CPI18nPipe, CPTopBanerComponent ],

  imports: [ CommonModule, RouterModule, ReactiveFormsModule ],

  providers: [ StoreService, FileUploadService, CPTrackingService ],

  exports: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPUploadButtonComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent,
  CPPageHeaderComponent, CPSearchBoxComponent, CPDatePipe,
  CPStarsComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPDatePickerComponent, CPSwitchComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent, CPPaginationComponent, CPNoContentComponent,
  CPCheckDropdownComponent, CPImageUploadComponent, SchoolSwitchComponent,
  CPTrackersComponent, CPUploadModalComponent, CPChipComponent, CPTypeAheadComponent,
  CPSnackBarComponent, CPTrackerDirective, CPButtonComponent, CPTextEditorComponent, CPI18nPipe,
  CPTopBanerComponent ]
})
export class SharedModule { }
