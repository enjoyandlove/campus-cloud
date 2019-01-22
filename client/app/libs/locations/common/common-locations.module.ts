import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@client/app/shared/shared.module';
import { LocationsCommonListComponent, LocationFormComponent, LocationsListTopBarComponent } from './components';

@NgModule({
  declarations: [
    LocationFormComponent,
    LocationsCommonListComponent,
    LocationsListTopBarComponent
  ],
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  exports: [
    LocationFormComponent,
    LocationsCommonListComponent,
    LocationsListTopBarComponent
  ]
})
export class CommonLocationsModule {}
