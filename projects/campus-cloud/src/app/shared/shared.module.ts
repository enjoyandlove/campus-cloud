import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  CPToolTipDirective,
  CPLightboxDirective,
  CPDatePickerDirective,
  CPImageRatioDirective,
  CPColorPickerDirective,
  CPCopyClipboardDirective
} from './directives';

// services
import {
  StoreService,
  CPMapsService,
  CPTrackingService,
  FileUploadService,
  CPLocationsService,
  CPAmplitudeService
} from './services';

import { LocationsService } from '../containers/controlpanel/manage/locations/locations.service';
import { CPLineChartUtilsService } from './components/cp-line-chart/cp-line-chart.utils.service';
import { CPRangePickerUtilsService } from './components/cp-range-picker/cp-range-picker.utils.service';

// pipes
import { CPDatePipe, CPFilterPipe, CPFIlterByLength } from './pipes';

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
  CPImageComponent,
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
  CPTrackersComponent,
  CPTopBanerComponent,
  CPFormLabelComponent,
  CPTypeAheadComponent,
  CPSearchBoxComponent,
  CPLineChartComponent,
  CPListModalComponent,
  CPNoContentComponent,
  CPDatePickerComponent,
  CPHeaderLinkComponent,
  CPPageHeaderComponent,
  CPPaginationComponent,
  CPTextEditorComponent,
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
  CPDropdownMultiSelectComponent
} from './components';

@NgModule({
  declarations: [
    CPDatePipe,
    CPFilterPipe,
    CPTabComponent,
    CPCardComponent,
    CPHostDirective,
    CPMapsComponent,
    CPMenuComponent,
    CPTabsComponent,
    CPChipComponent,
    CPImageComponent,
    CPStarsComponent,
    CPModalComponent,
    CPAlertComponent,
    CPFIlterByLength,
    CPSwitchComponent,
    CPAvatarComponent,
    CPTargetDirective,
    CPButtonComponent,
    CPSpinnerComponent,
    CPToolTipDirective,
    CPTrackerDirective,
    CPWorkingComponent,
    CPMenuItemComponent,
    CPTopBanerComponent,
    CPDropdownComponent,
    CPCheckboxComponent,
    CPTrackersComponent,
    CPSnackBarComponent,
    CPLightboxDirective,
    CPFormLabelComponent,
    CPLightboxComponent,
    CPNoContentComponent,
    CPTypeAheadComponent,
    CPSearchBoxComponent,
    CPListModalComponent,
    CPLineChartComponent,
    CPPageHeaderComponent,
    CPDatePickerComponent,
    CPImageRatioDirective,
    CPPaginationComponent,
    CPTextEditorComponent,
    CPDatePickerDirective,
    CPHeaderLinkComponent,
    CPUploadModalComponent,
    CPColorPickerDirective,
    CPDeleteModalComponent,
    CPImageUploadComponent,
    CPRangePickerComponent,
    CPCharCounterComponent,
    CPImageCropperComponent,
    CPUploadButtonComponent,
    CPSortingHeaderComponent,
    CPCheckDropdownComponent,
    CPCopyClipboardDirective,
    CPResourceBannerComponent,
    CPFormFixedFooterComponent,
    CPUploadModalBodyComponent,
    CPUploadModalFooterComponent,
    CPUploadModalHeaderComponent,
    CPPlaceAutoCompleteComponent,
    CPDropdownMultiSelectComponent
  ],

  entryComponents: [CPLightboxComponent, CPImageCropperComponent],

  imports: [
    A11yModule,
    FormsModule,
    CommonModule,
    RouterModule,
    OverlayModule,
    CPTopBarModule,
    ReactiveFormsModule
  ],

  providers: [
    CPDatePipe,
    StoreService,
    CPMapsService,
    LocationsService,
    LatLngValidators,
    CPTrackingService,
    FileUploadService,
    CPLocationsService,
    CPAmplitudeService,
    CPLineChartUtilsService,
    CPRangePickerUtilsService
  ],

  exports: [
    CPDatePipe,
    CPFilterPipe,
    CPTopBarModule,
    CPTabComponent,
    CPCardComponent,
    CPMapsComponent,
    CPMenuComponent,
    CPHostDirective,
    CPTabsComponent,
    CPChipComponent,
    CPImageComponent,
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
    CPToolTipDirective,
    CPWorkingComponent,
    CPDropdownComponent,
    CPMenuItemComponent,
    CPTrackersComponent,
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
    CPLineChartComponent,
    CPHeaderLinkComponent,
    CPDatePickerDirective,
    CPTextEditorComponent,
    CPPageHeaderComponent,
    CPDatePickerComponent,
    CPPaginationComponent,
    CPImageRatioDirective,
    CPDeleteModalComponent,
    CPImageUploadComponent,
    CPUploadModalComponent,
    CPCharCounterComponent,
    CPColorPickerDirective,
    CPRangePickerComponent,
    CPUploadButtonComponent,
    CPImageCropperComponent,
    CPCheckDropdownComponent,
    CPSortingHeaderComponent,
    CPCopyClipboardDirective,
    CPResourceBannerComponent,
    CPFormFixedFooterComponent,
    CPUploadModalBodyComponent,
    CPPlaceAutoCompleteComponent,
    CPUploadModalHeaderComponent,
    CPUploadModalFooterComponent,
    CPDropdownMultiSelectComponent
  ]
})
export class SharedModule {}
