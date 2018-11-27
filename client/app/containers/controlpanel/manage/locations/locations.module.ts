import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { reducers, effects } from './store';

import { LocationsListComponent } from './list';
import { LocationsDeleteComponent } from './delete';
import { LocationsUpdateComponent } from './update';
import { LocationsCreateComponent } from './create';
import { LocationsListTopBarComponent } from './list/components';

import { LocationsService } from './locations.service';
import { SharedModule } from '../../../../shared/shared.module';
import { LocationsRoutingModule } from './locations.routing.module';

@NgModule({
  declarations: [
    LocationsListComponent,
    LocationsDeleteComponent,
    LocationsUpdateComponent,
    LocationsListTopBarComponent,
    LocationsCreateComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    LocationsRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('locations', reducers)
  ],

  providers: [LocationsService]
})
export class LocationsModule {}
