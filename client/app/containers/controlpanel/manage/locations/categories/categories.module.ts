import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { CategoriesListComponent } from './list';
import { CategoriesActionBoxComponent } from './list/components/action-box';


import { effects, reducers } from './store';
import { SharedModule } from '@shared/shared.module';
import { CategoriesService } from './categories.service';
import { CategoriesRoutingModule } from './categories.routing.module';

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
