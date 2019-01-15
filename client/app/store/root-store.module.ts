import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BaseStoreModule } from './base';
import { ManageStoreModule } from './manage';
import { routerReducers } from '@app/store/base/router-state';

@NgModule({
  imports: [
    CommonModule,
    BaseStoreModule,
    ManageStoreModule,
    StoreModule.forRoot(routerReducers),
    EffectsModule.forRoot([])
  ],
  declarations: []
})
export class RootStoreModule {}
