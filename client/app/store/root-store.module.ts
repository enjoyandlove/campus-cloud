import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BaseStoreModule } from './base';
import { ManageStoreModule } from './manage';

@NgModule({
  imports: [
    CommonModule,
    BaseStoreModule,
    ManageStoreModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([])
  ],
  declarations: []
})
export class RootStoreModule {}
