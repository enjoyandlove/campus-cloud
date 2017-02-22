import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CPMapsComponent, CPModalComponent, CPTopBarComponent, CPAvatarComponent,
  CPSpinnerComponent, CPDropdownComponent,
  CPCheckboxComponent, CPHamburgerComponent, CPMobileMenuComponent, CPImageUploadComponent,
  CPPlaceAutoCompleteComponent, CPPageHeaderComponent, CPSearchBoxComponent,
  CPStarComponent, CPAlertComponent, CPAnimatedButtonComponent,
  CPButtonDropdownComponent, CPDatePickerComponent, CPSwitchComponent, CPSmallDatePickerComponent
} from './components';

import {
  CPDatePipe,
  CPFilterPipe
} from './pipes';

import {
  StoreService
} from './services';

@NgModule({
  declarations: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPMobileMenuComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPImageUploadComponent,
  CPSpinnerComponent, CPDropdownComponent,  CPCheckboxComponent,
  CPPageHeaderComponent, CPHamburgerComponent, CPSearchBoxComponent,
  CPDatePipe, CPStarComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPAnimatedButtonComponent,
  CPButtonDropdownComponent, CPDatePickerComponent, CPSwitchComponent,
  CPAnimatedButtonComponent, CPButtonDropdownComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent ],

  imports: [ CommonModule, RouterModule, ReactiveFormsModule ],

  providers: [ StoreService ],

  exports: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPMobileMenuComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPImageUploadComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent,
  CPPageHeaderComponent, CPHamburgerComponent, CPSearchBoxComponent,
  CPDatePipe, CPStarComponent, CPFilterPipe, CPAlertComponent,
  CPAlertComponent, CPAnimatedButtonComponent,
  CPButtonDropdownComponent, CPDatePickerComponent, CPSwitchComponent,
  CPAnimatedButtonComponent, CPButtonDropdownComponent, CPDatePickerComponent,
  CPSmallDatePickerComponent  ]
})
export class SharedModule { }
