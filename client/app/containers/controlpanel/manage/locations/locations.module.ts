import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { LocationsListComponent } from './list';
import { LocationsDeleteComponent } from './delete';
import { LocationsUpdateComponent } from './update';
import { LocationsCreateComponent } from './create';
import { LocationsListTopBarComponent } from './list/components';
import { LocationFormComponent, LocationOpeningHoursFormComponent } from './components';

import { LocationsService } from './locations.service';
import { SharedModule } from '@app/shared/shared.module';
import { LocationsUtilsService } from './locations.utils';
import { LocationsRoutingModule } from './locations.routing.module';

import { LocationExistsGuard } from './guards';
import { reducers, effects, CustomSerializer } from './store';

@NgModule({
  declarations: [
    LocationsListComponent,
    LocationFormComponent,
    LocationsDeleteComponent,
    LocationsUpdateComponent,
    LocationsCreateComponent,
    LocationsListTopBarComponent,
    LocationOpeningHoursFormComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    LocationsRoutingModule,
    StoreRouterConnectingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('locations', reducers)
  ],

  providers: [
    LocationExistsGuard,
    LocationsService,
    LocationsUtilsService,
    {
      provide: RouterStateSerializer, useClass: CustomSerializer
    }
  ]
})
export class LocationsModule {}
