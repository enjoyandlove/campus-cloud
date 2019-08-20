import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { CategoriesListComponent } from './list';
import { CategoriesEditComponent } from './edit';
import { CategoriesDeleteComponent } from './delete';
import { CategoriesCreateComponent } from './create';

import { effects, reducers } from './store';
import { CategoriesService } from './categories.service';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CategoriesRoutingModule } from './categories.routing.module';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import { CommonCategoriesModule } from '@campus-cloud/libs/locations/common/categories/common-categories.module';

@NgModule({
  declarations: [
    CategoriesEditComponent,
    CategoriesListComponent,
    CategoriesCreateComponent,
    CategoriesDeleteComponent
  ],

  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    ImageModule.forRoot(),
    CommonCategoriesModule,
    CategoriesRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('locationCategories', reducers)
  ],

  providers: [CategoriesService, LocationsUtilsService]
})
export class CategoriesModule {}
