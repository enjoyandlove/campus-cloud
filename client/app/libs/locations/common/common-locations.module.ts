import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@client/app/shared/shared.module';
import { LocationsListComponent, LocationFormComponent, LocationsListTopBarComponent } from './components';

@NgModule({
  declarations: [
    LocationFormComponent,
    LocationsListComponent,
    LocationsListTopBarComponent
  ],
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  exports: [
    LocationFormComponent,
    LocationsListComponent,
    LocationsListTopBarComponent
  ]
})
export class CommonLocationsModule {}
