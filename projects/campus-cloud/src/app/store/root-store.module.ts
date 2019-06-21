import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { BaseStoreModule } from './base';
import { ManageStoreModule } from './manage';

@NgModule({
  imports: [
    CommonModule,
    BaseStoreModule,
    ManageStoreModule,
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: false,
          strictStateSerializability: true,
          strictActionSerializability: false
        }
      }
    ),
    EffectsModule.forRoot([])
  ],
  declarations: []
})
export class RootStoreModule {}
