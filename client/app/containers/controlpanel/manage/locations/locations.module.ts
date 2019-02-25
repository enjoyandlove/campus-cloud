import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { LocationsInfoComponent } from './info';
import { LocationsListComponent } from './list';
import { LocationsEditComponent } from './edit';
import { LocationsDeleteComponent } from './delete';
import { LocationsCreateComponent } from './create';

import { LocationsService } from './locations.service';
import { SharedModule } from '@app/shared/shared.module';
import { LocationsUtilsService } from '@libs/locations/common/utils';
import { LocationsRoutingModule } from './locations.routing.module';

import { reducers, effects } from './store';
import { LocationExistsGuard } from './guards';
import { LayoutsModule } from '@app/layouts/layouts.module';
import { CustomSerializer } from '@app/store/base/router-state';
import { CategoriesModule } from './categories/categories.module';
import { LocationsTimeLabelPipe } from '@libs/locations/common/pipes';
import { CommonLocationsModule } from '@libs/locations/common/common-locations.module';

@NgModule({
  declarations: [
    LocationsListComponent,
    LocationsInfoComponent,
    LocationsEditComponent,
    LocationsTimeLabelPipe,
    LocationsDeleteComponent,
    LocationsCreateComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    LayoutsModule,
    CategoriesModule,
    ReactiveFormsModule,
    CommonLocationsModule,
    LocationsRoutingModule,
    StoreRouterConnectingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('locations', reducers)
  ],

  providers: [
    LocationsService,
    LocationExistsGuard,
    LocationsUtilsService,
    LocationsTimeLabelPipe,
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer
    }
  ]
})
export class LocationsModule {}
