import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { CategoriesListComponent } from './list';
import { CategoriesEditComponent } from './edit';
import { CategoriesDeleteComponent } from './delete';
import { CategoriesCreateComponent } from './create';
import { CategoryFormComponent } from './components';
import { CategoriesActionBoxComponent } from './list/components';


import { CategoryTypePipe } from './pipes';
import { effects, reducers } from './store';
import { SharedModule } from '@shared/shared.module';
import { CategoriesService } from './categories.service';
import { CategoriesRoutingModule } from './categories.routing.module';

@NgModule({
  declarations: [
    CategoryTypePipe,
    CategoryFormComponent,
    CategoriesEditComponent,
    CategoriesListComponent,
    CategoriesCreateComponent,
    CategoriesDeleteComponent,
    CategoriesActionBoxComponent
  ],

  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    CategoriesRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('locationCategories', reducers),
  ],

  providers: [CategoriesService]
})
export class CategoriesModule {}
