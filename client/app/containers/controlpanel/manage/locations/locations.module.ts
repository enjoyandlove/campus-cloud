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
import { LocationsListTopBarComponent } from './list/components';
import { LocationsDayLabelPipe, LocationsTimeLabelPipe } from './pipes';
import { LocationFormComponent, LocationOpeningHoursFormComponent } from './components';

import { LocationsService } from './locations.service';
import { SharedModule } from '@app/shared/shared.module';
import { LocationsUtilsService } from './locations.utils';
import { LocationsRoutingModule } from './locations.routing.module';

import { reducers, effects } from './store';
import { LocationExistsGuard } from './guards';
import { CustomSerializer } from '@app/store/base/router-state';
import { CategoriesModule } from './categories/categories.module';

@NgModule({
  declarations: [
    LocationsDayLabelPipe,
    LocationFormComponent,
    LocationsTimeLabelPipe,
    LocationsListComponent,
    LocationsInfoComponent,
    LocationsEditComponent,
    LocationsDeleteComponent,
    LocationsCreateComponent,
    LocationsListTopBarComponent,
    LocationOpeningHoursFormComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    LocationsRoutingModule,
    CategoriesModule,
    StoreRouterConnectingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('locations', reducers)
  ],

  providers: [
    LocationsService,
    LocationExistsGuard,
    LocationsUtilsService,
    {
      provide: RouterStateSerializer, useClass: CustomSerializer
    }
  ]
})
export class LocationsModule {}
