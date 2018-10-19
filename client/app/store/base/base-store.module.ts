import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { baseReducers } from './reducers';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature('base', baseReducers)]
})
export class BaseStoreModule {}
