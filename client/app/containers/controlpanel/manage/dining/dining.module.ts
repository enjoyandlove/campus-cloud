import { RouterStateSerializer } from '@ngrx/router-store';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';

import { DiningExistGuard } from './guards';
import { DiningListComponent } from './list';
import { DiningInfoComponent } from './info';
import { DiningDeleteComponent } from './delete';
import { DiningService } from './dining.service';
import { SharedModule } from '@shared/shared.module';
import { DiningRoutingModule } from './dining.routing.module';
import { LocationsModule } from '../locations/locations.module';
import { CustomSerializer } from '@app/store/base/router-state';
import { CommonLocationsModule } from '@libs/locations/common/common-locations.module';

@NgModule({
  declarations: [
    DiningListComponent,
    DiningInfoComponent,
    DiningDeleteComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    DiningRoutingModule,
    LocationsModule,
    CommonLocationsModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('dining', reducers)
  ],

  providers: [
    DiningService,
    DiningExistGuard,
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer
    }
  ]
})

export class DiningModule {}
