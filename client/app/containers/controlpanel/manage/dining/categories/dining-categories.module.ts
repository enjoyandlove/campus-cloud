import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { DiningCategoriesListComponent } from './list';
import { DiningCategoriesEditComponent } from './edit';
import { DiningCategoriesCreateComponent } from './create';
import { DiningCategoriesDeleteComponent } from './delete';

import { effects, reducers } from './store';
import { SharedModule } from '@shared/shared.module';
import { DiningCategoriesService } from './dining-categories.service';
import { DiningCategoriesRoutingModule } from './dining-categories.routing.module';
import { CommonCategoriesModule } from '@libs/locations/common/categories/common-categories.module';

@NgModule({
  declarations: [
    DiningCategoriesListComponent,
    DiningCategoriesEditComponent,
    DiningCategoriesDeleteComponent,
    DiningCategoriesCreateComponent
  ],

  entryComponents: [
    DiningCategoriesEditComponent,
    DiningCategoriesCreateComponent,
    DiningCategoriesDeleteComponent
  ],

  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    CommonCategoriesModule,
    DiningCategoriesRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('diningCategories', reducers),
  ],

  providers: [DiningCategoriesService]
})
export class DiningCategoriesModule {}
