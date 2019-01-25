import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocationsDayLabelPipe } from './pipes';
import { SharedModule } from '@client/app/shared/shared.module';
import { LocationsTimeLabelPipe } from '@libs/locations/common/pipes';
import { LocationsCommonListComponent, LocationFormComponent, LocationsListTopBarComponent } from './components';

@NgModule({
  declarations: [
    LocationsDayLabelPipe,
    LocationFormComponent,
    LocationsTimeLabelPipe,
    LocationsCommonListComponent,
    LocationsListTopBarComponent
  ],
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  exports: [
    LocationFormComponent,
    LocationsDayLabelPipe,
    LocationsTimeLabelPipe,
    LocationsCommonListComponent,
    LocationsListTopBarComponent
  ],
  providers: [LocationsTimeLabelPipe]
})
export class CommonLocationsModule {}
