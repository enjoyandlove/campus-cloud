import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CPTrackerDirective } from './directives';
import { CPDatePipe, CPFilterPipe, CPI18nPipe } from './pipes';
import {
  FileUploadService,
  StoreService,
  CPLocationsService,
} from './services';
import { CPTrackingService } from './services/tracking.service';

import {
  CPAvatarComponent,
  CPMapsComponent,
  CPModalComponent,
  CPTopBarComponent,
  CPSpinnerComponent,
  CPDropdownComponent,
  CPCheckboxComponent,
  CPPlaceAutoCompleteComponent,
  CPPageHeaderComponent,
  CPSearchBoxComponent,
  CPStarsComponent,
  CPAlertComponent,
  CPDatePickerComponent,
  CPSwitchComponent,
  CPSmallDatePickerComponent,
  CPUploadButtonComponent,
  CPPaginationComponent,
  CPNoContentComponent,
  CPCheckDropdownComponent,
  CPImageUploadComponent,
  SchoolSwitchComponent,
  CPTrackersComponent,
  CPChipComponent,
  CPTypeAheadComponent,
  CPUploadModalComponent,
  CPSnackBarComponent,
  CPButtonComponent,
  CPTextEditorComponent,
  CPTopBanerComponent,
  CPOnboardingComponent,
  CPStepperComponent
  CPTooltipComponent,
  CPResourceBannerComponent
} from './components';
import { LocationsService } from '../containers/controlpanel/manage/locations/locations.service';
import { CPMapsService } from './services/maps.service';

@NgModule({
  declarations: [
    CPTopBarComponent,
    CPMapsComponent,
    CPAvatarComponent,
    CPModalComponent,
    CPPlaceAutoCompleteComponent,
    CPUploadButtonComponent,
    CPSpinnerComponent,
    CPDropdownComponent,
    CPCheckboxComponent,
    CPPageHeaderComponent,
    CPSearchBoxComponent,
    CPDatePipe,
    CPStarsComponent,
    CPFilterPipe,
    CPAlertComponent,
    CPAlertComponent,
    CPDatePickerComponent,
    CPSwitchComponent,
    CPDatePickerComponent,
    CPSmallDatePickerComponent,
    CPPaginationComponent,
    CPNoContentComponent,
    CPCheckDropdownComponent,
    CPImageUploadComponent,
    SchoolSwitchComponent,
    CPTrackersComponent,
    CPUploadModalComponent,
    CPChipComponent,
    CPTypeAheadComponent,
    CPSnackBarComponent,
    CPTrackerDirective,
    CPButtonComponent,
    CPTextEditorComponent,
    CPI18nPipe,
    CPTopBanerComponent,
    CPOnboardingComponent,
    CPStepperComponent
    CPTooltipComponent,
    CPResourceBannerComponent
  ],

  imports: [CommonModule, RouterModule, ReactiveFormsModule],

  providers: [
    StoreService,
    FileUploadService,
    CPTrackingService,
    CPLocationsService,
    LocationsService,
    CPMapsService,
  ],

  exports: [
    CPTopBarComponent,
    CPMapsComponent,
    CPAvatarComponent,
    CPModalComponent,
    CPPlaceAutoCompleteComponent,
    CPUploadButtonComponent,
    CPSpinnerComponent,
    CPDropdownComponent,
    CPCheckboxComponent,
    CPPageHeaderComponent,
    CPSearchBoxComponent,
    CPDatePipe,
    CPStarsComponent,
    CPFilterPipe,
    CPAlertComponent,
    CPAlertComponent,
    CPDatePickerComponent,
    CPSwitchComponent,
    CPDatePickerComponent,
    CPSmallDatePickerComponent,
    CPPaginationComponent,
    CPNoContentComponent,
    CPCheckDropdownComponent,
    CPImageUploadComponent,
    SchoolSwitchComponent,
    CPTrackersComponent,
    CPUploadModalComponent,
    CPChipComponent,
    CPTypeAheadComponent,
    CPSnackBarComponent,
    CPTrackerDirective,
    CPButtonComponent,
    CPTextEditorComponent,
    CPI18nPipe,
    CPTopBanerComponent,
    CPOnboardingComponent,
    CPStepperComponent
    CPTooltipComponent,
    CPResourceBannerComponent
  ],
})
export class SharedModule {}
