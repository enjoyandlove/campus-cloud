import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CPMapsComponent, CPModalComponent, CPTopBarComponent, CPAvatarComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent,
  CPHamburgerComponent, CPPlaceAutoCompleteComponent,
  CPPageHeaderComponent, CPSearchBoxComponent, CPStarsComponent,
  CPAlertComponent, CPAnimatedButtonComponent,
  CPDatePickerComponent, CPSwitchComponent, CPSmallDatePickerComponent, CPUploadButtonComponent,
} from './components';

import {
  CPDatePipe,
  CPFilterPipe
} from './pipes';

import {
  StoreService,
  FileUploadService
} from './services';

@NgModule({
  declarations: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPUploadButtonComponent,
  CPSpinnerComponent, CPDropdownComponent,  CPCheckboxComponent,
  CPPageHeaderComponent, CPHamburgerComponent, CPSearchBoxComponent,
  CPDatePipe, CPStarsComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPAnimatedButtonComponent, CPDatePickerComponent, CPSwitchComponent,
  CPAnimatedButtonComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent ],

  imports: [ CommonModule, RouterModule, ReactiveFormsModule ],

  providers: [ StoreService, FileUploadService ],

  exports: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPUploadButtonComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent,
  CPPageHeaderComponent, CPHamburgerComponent, CPSearchBoxComponent,
  CPDatePipe, CPStarsComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPAnimatedButtonComponent, CPDatePickerComponent, CPSwitchComponent,
  CPAnimatedButtonComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent ]
})
export class SharedModule { }
