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

import { LocationsService } from './locations.service';
import { SharedModule } from '@app/shared/shared.module';
import { LocationsRoutingModule } from './locations.routing.module';

import { LocationExistsGuard } from './guards';
import { reducers, effects, CustomSerializer } from './store';

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
    StoreRouterConnectingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('locations', reducers)
  ],

  providers: [
    LocationExistsGuard,
    LocationsService,
    {
      provide: RouterStateSerializer, useClass: CustomSerializer
    }
  ]
})
export class LocationsModule {}
