import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { ApiListComponent } from './list';
import { reducers, effects } from './store';

import {
  ApiManagementKeyComponent,
  ApiManagementTopbarComponent,
  ApiManagementHowToUseComponent
} from './components';

import { ApiManagementService } from './api-management.service';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ApiManagementComponent } from './api-management.component';
import { ApiManagementUtilsService } from './api-management.utils.service';
import { ApiManagementRoutingModule } from './api-management.routing.module';

@NgModule({
  declarations: [
    ApiListComponent,
    ApiManagementComponent,
    ApiManagementKeyComponent,
    ApiManagementTopbarComponent,
    ApiManagementHowToUseComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    ApiManagementRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('apiManagement', reducers)
  ],

  providers: [ApiManagementService, ApiManagementUtilsService]
})
export class ApiManagementModule {}
