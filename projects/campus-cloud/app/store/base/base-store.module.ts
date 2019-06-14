import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { baseReducers } from './reducers';
import { CustomSerializer } from '@app/store/serializers';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('base', baseReducers, {
      initialState: {
        ROUTER: {
          state: {
            url: window.location.pathname,
            params: {},
            queryParams: {}
          },
          navigationId: 0
        }
      }
    }),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'ROUTER',
      serializer: CustomSerializer
    })
  ]
})
export class BaseStoreModule {}
