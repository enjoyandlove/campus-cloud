import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { CategoriesListComponent } from './list';
import { CategoriesActionBoxComponent } from './list/components/action-box';


import { SharedModule } from '@shared/shared.module';
import { CategoriesService } from './categories.service';
import { CategoriesRoutingModule } from './categories.routing.module';
import { EffectsModule } from '@ngrx/effects';
import { effects, reducers } from './store';

@NgModule({
  declarations: [
    CategoriesListComponent,
    CategoriesActionBoxComponent
  ],

  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    CategoriesRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('categories', reducers),
  ],

  providers: [CategoriesService]
})
export class CategoriesModule {}
