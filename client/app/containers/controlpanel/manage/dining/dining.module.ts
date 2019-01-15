import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';

import { DiningListComponent } from './list';
import { DiningCreateComponent } from './create';
import { DiningService } from './dining.service';
import { SharedModule } from '@shared/shared.module';
import { DiningRoutingModule } from './dining.routing.module';
import { LocationsModule } from '../locations/locations.module';

@NgModule({
  declarations: [
    DiningListComponent,
    DiningCreateComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    DiningRoutingModule,
    LocationsModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('dining', reducers)
  ],

  providers: [
    DiningService
  ]
})

export class DiningModule {}
