import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';

// directives
import {
  CPHostDirective,
  CPTargetDirective,
  CPTrackerDirective,
  CPLightboxDirective,
  TextEditorDirective,
  CPDatePickerDirective,
  CPImageRatioDirective,
  CPImageCropperDirective,
  CPCopyClipboardDirective
} from './directives';

// services
import {
  StoreService,
  ImageService,
  CPMapsService,
  CPTrackingService,
  FileUploadService,
  CPLocationsService,
  CPAmplitudeService,
  ImageValidatorService
} from './services';

import { LocationsService } from '../containers/controlpanel/manage/locations/locations.service';
import { CPRangePickerUtilsService } from './components/cp-range-picker/cp-range-picker.utils.service';

// pipes
import { CPUrlify, CPDatePipe, CPFilterPipe, CPFIlterByLength, CPBoldifyPipe, BreakLinesPipe } from './pipes';

// components
import { CPTabsComponent } from './components/cp-tabs/components/cp-tabs/cp-tabs.component';

import { LatLngValidators } from '@campus-cloud/shared/validators';

import { CPTopBarModule } from '@campus-cloud/shared/components/cp-topbar/cp-topbar.module';

import {
  CPTabComponent,
  CPCardComponent,
  CPChipComponent,
  CPMapsComponent,
  CPMenuComponent,
  CPAlertComponent,
  CPModalComponent,
  CPStarsComponent,
  CPAvatarComponent,
  CPButtonComponent,
  CPSwitchComponent,
  CPWorkingComponent,
  CPSpinnerComponent,
  CPMenuItemComponent,
  CPSnackBarComponent,
  CPCheckboxComponent,
  CPDropdownComponent,
  CPLightboxComponent,
  CPTopBanerComponent,
  CPFormLabelComponent,
  CPTypeAheadComponent,
  CPSearchBoxComponent,
  CPListModalComponent,
  CPNoContentComponent,
  CPDatePickerComponent,
  CPHeaderLinkComponent,
  CPPageHeaderComponent,
  CPPaginationComponent,
  CPDeleteModalComponent,
  CPRangePickerComponent,
  CPImageUploadComponent,
  CPUploadModalComponent,
  CPCharCounterComponent,
  CPUploadButtonComponent,
  CPImageCropperComponent,
  CPCheckDropdownComponent,
  CPSortingHeaderComponent,
  CPResourceBannerComponent,
  CPFormFixedFooterComponent,
  CPUploadModalBodyComponent,
  CPPlaceAutoCompleteComponent,
  CPUploadModalFooterComponent,
  CPUploadModalHeaderComponent,
  CPDropdownMultiSelectComponent,
  CPUnsavedChangesModalComponent
} from './components';

@NgModule({
  declarations: [
    CPUrlify,
    CPDatePipe,
    CPFilterPipe,
    CPBoldifyPipe,
    CPTabComponent,
    CPCardComponent,
    CPHostDirective,
    CPMapsComponent,
    CPMenuComponent,
    CPTabsComponent,
    CPChipComponent,
    CPStarsComponent,
    CPModalComponent,
    CPAlertComponent,
    CPFIlterByLength,
    CPSwitchComponent,
    CPAvatarComponent,
    CPTargetDirective,
    CPButtonComponent,
    CPSpinnerComponent,
    CPTrackerDirective,
    CPWorkingComponent,
    CPMenuItemComponent,
    CPTopBanerComponent,
    CPDropdownComponent,
    TextEditorDirective,
    CPCheckboxComponent,
    CPSnackBarComponent,
    CPLightboxDirective,
    CPFormLabelComponent,
    CPLightboxComponent,
    CPNoContentComponent,
    CPTypeAheadComponent,
    CPSearchBoxComponent,
    CPListModalComponent,
    CPPageHeaderComponent,
    CPDatePickerComponent,
    CPImageRatioDirective,
    CPPaginationComponent,
    CPDatePickerDirective,
    CPHeaderLinkComponent,
    CPUploadModalComponent,
    CPDeleteModalComponent,
    CPImageUploadComponent,
    CPRangePickerComponent,
    CPCharCounterComponent,
    CPImageCropperComponent,
    CPUploadButtonComponent,
    CPImageCropperDirective,
    CPSortingHeaderComponent,
    CPCheckDropdownComponent,
    CPCopyClipboardDirective,
    CPResourceBannerComponent,
    CPFormFixedFooterComponent,
    CPUploadModalBodyComponent,
    CPUploadModalFooterComponent,
    CPUploadModalHeaderComponent,
    CPPlaceAutoCompleteComponent,
    CPDropdownMultiSelectComponent,
    CPUnsavedChangesModalComponent,
    BreakLinesPipe
  ],

  entryComponents: [CPLightboxComponent, CPImageCropperComponent],

  imports: [
    A11yModule,
    FormsModule,
    CommonModule,
    RouterModule,
    ReadyUiModule,
    OverlayModule,
    CPTopBarModule,
    ReactiveFormsModule
  ],

  providers: [
    CPDatePipe,
    StoreService,
    ImageService,
    CPMapsService,
    LocationsService,
    LatLngValidators,
    CPTrackingService,
    FileUploadService,
    CPLocationsService,
    CPAmplitudeService,
    ImageValidatorService,
    CPRangePickerUtilsService
  ],

  exports: [
    CPUrlify,
    CPDatePipe,
    CPFilterPipe,
    CPBoldifyPipe,
    ReadyUiModule,
    CPTopBarModule,
    CPTabComponent,
    CPCardComponent,
    CPMapsComponent,
    CPMenuComponent,
    CPHostDirective,
    CPTabsComponent,
    CPChipComponent,
    CPFIlterByLength,
    CPStarsComponent,
    CPAlertComponent,
    CPModalComponent,
    CPSwitchComponent,
    CPAvatarComponent,
    CPTargetDirective,
    CPButtonComponent,
    CPTrackerDirective,
    CPSpinnerComponent,
    CPWorkingComponent,
    TextEditorDirective,
    CPDropdownComponent,
    CPMenuItemComponent,
    CPCheckboxComponent,
    CPSnackBarComponent,
    CPTopBanerComponent,
    CPLightboxComponent,
    CPLightboxDirective,
    CPFormLabelComponent,
    CPListModalComponent,
    CPNoContentComponent,
    CPTypeAheadComponent,
    CPSearchBoxComponent,
    CPHeaderLinkComponent,
    CPDatePickerDirective,
    CPPageHeaderComponent,
    CPDatePickerComponent,
    CPPaginationComponent,
    CPImageRatioDirective,
    CPDeleteModalComponent,
    CPImageUploadComponent,
    CPUploadModalComponent,
    CPCharCounterComponent,
    CPRangePickerComponent,
    CPUploadButtonComponent,
    CPImageCropperComponent,
    CPImageCropperDirective,
    CPCheckDropdownComponent,
    CPSortingHeaderComponent,
    CPCopyClipboardDirective,
    CPResourceBannerComponent,
    CPFormFixedFooterComponent,
    CPUploadModalBodyComponent,
    CPPlaceAutoCompleteComponent,
    CPUploadModalHeaderComponent,
    CPUploadModalFooterComponent,
    CPDropdownMultiSelectComponent,
    CPUnsavedChangesModalComponent,
    BreakLinesPipe
  ]
})
export class SharedModule {}
