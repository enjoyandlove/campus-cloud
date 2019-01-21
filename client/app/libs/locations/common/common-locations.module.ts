import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@client/app/shared/shared.module';
import { LocationsDayLabelPipe, LocationsTimeLabelPipe } from '@libs/locations/common/pipes';
import { LocationsListComponent, LocationFormComponent, LocationsListTopBarComponent } from './components';

@NgModule({
  declarations: [
    LocationsDayLabelPipe,
    LocationFormComponent,
    LocationsTimeLabelPipe,
    LocationsListComponent,
    LocationsListTopBarComponent
  ],
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  exports: [
    LocationFormComponent,
    LocationsDayLabelPipe,
    LocationsListComponent,
    LocationsTimeLabelPipe,
    LocationsListTopBarComponent,
  ]
})
export class CommonLocationsModule {}
