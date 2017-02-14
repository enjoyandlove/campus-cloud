import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CPMapsComponent, CPModalComponent, CPTopBarComponent, CPAvatarComponent,
  CPSpinnerComponent, CPDropdownComponent,
  CPCheckboxComponent, CPHamburgerComponent, CPMobileMenuComponent, CPImageUploadComponent,
  CPPlaceAutoCompleteComponent, CPPageHeaderComponent, CPSearchBoxComponent, CPStarComponent
} from './components';

import {
  CPDatePipe,
  CPFilterPipe
} from './pipes';

@NgModule({
  declarations: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPMobileMenuComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPImageUploadComponent,
  CPSpinnerComponent, CPDropdownComponent,  CPCheckboxComponent,
  CPPageHeaderComponent, CPHamburgerComponent, CPSearchBoxComponent,
  CPDatePipe, CPStarComponent, CPFilterPipe ],

  imports: [ CommonModule, RouterModule ],

  providers: [ ],

  exports: [ CPTopBarComponent, CPMapsComponent,
  CPAvatarComponent, CPMobileMenuComponent, CPModalComponent,
  CPPlaceAutoCompleteComponent, CPImageUploadComponent,
  CPSpinnerComponent, CPDropdownComponent, CPCheckboxComponent,
  CPPageHeaderComponent, CPHamburgerComponent, CPSearchBoxComponent,
  CPDatePipe, CPStarComponent, CPFilterPipe ]
})
export class SharedModule { }
