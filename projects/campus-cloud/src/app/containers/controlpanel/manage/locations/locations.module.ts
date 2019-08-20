import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';
import { LocationExistsGuard } from './guards';
import { LocationsInfoComponent } from './info';
import { LocationsListComponent } from './list';
import { LocationsEditComponent } from './edit';
import { LocationsDeleteComponent } from './delete';
import { LocationsCreateComponent } from './create';
import { LocationsService } from './locations.service';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CategoriesModule } from './categories/categories.module';
import { LocationsRoutingModule } from './locations.routing.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import { LocationsTimeLabelPipe } from '@campus-cloud/libs/locations/common/pipes';
import { CommonLocationsModule } from '@campus-cloud/libs/locations/common/common-locations.module';

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
    ImageModule.forRoot(),
    LocationsRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('locations', reducers)
  ],

  providers: [LocationsService, LocationExistsGuard, LocationsUtilsService, LocationsTimeLabelPipe]
})
export class LocationsModule {}
