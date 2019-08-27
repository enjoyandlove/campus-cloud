import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { BaseStoreModule } from './base';
import { ManageStoreModule } from './manage';
import { CustomSerializer } from '@campus-cloud/store/serializers';

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
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true
        }
      }
    ),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
      routerState: RouterState.Minimal
    }),
    EffectsModule.forRoot([])
  ],
  declarations: []
})
export class RootStoreModule {}
