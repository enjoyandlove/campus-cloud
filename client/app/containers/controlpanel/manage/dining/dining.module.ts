import { RouterStateSerializer } from '@ngrx/router-store';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';

import { DiningExistGuard } from './guards';
import { DiningListComponent } from './list';
import { DiningInfoComponent } from './info';
import { DiningEditComponent } from './edit';
import { DiningCreateComponent } from './create';
import { DiningDeleteComponent } from './delete';

import { DiningService } from './dining.service';
import { SharedModule } from '@shared/shared.module';
import { LayoutsModule } from '@app/layouts/layouts.module';
import { DiningRoutingModule } from './dining.routing.module';
import { LocationsModule } from '../locations/locations.module';
import { CustomSerializer } from '@app/store/base/router-state';
import { DiningCategoriesModule } from './categories/dining-categories.module';
import { CommonLocationsModule } from '@libs/locations/common/common-locations.module';

@NgModule({
  declarations: [
    DiningListComponent,
    DiningInfoComponent,
    DiningEditComponent,
    DiningCreateComponent,
    DiningDeleteComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    LayoutsModule,
    DiningCategoriesModule, // sorting based on route loading
    DiningRoutingModule,
    LocationsModule,
    ReactiveFormsModule,
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
