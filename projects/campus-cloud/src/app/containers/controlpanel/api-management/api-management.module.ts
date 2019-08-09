import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { ApiListComponent } from './list';
import { ApiCreateComponent } from './create';
import { ApiDeleteComponent } from './delete';

import { reducers, effects } from './store';

import {
  ApiManagementKeyComponent,
  ApiManagementFormComponent,
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
    ApiCreateComponent,
    ApiDeleteComponent,
    ApiManagementComponent,
    ApiManagementKeyComponent,
    ApiManagementFormComponent,
    ApiManagementTopbarComponent,
    ApiManagementHowToUseComponent
  ],

  entryComponents: [ApiDeleteComponent],

  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ApiManagementRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('apiManagement', reducers)
  ],

  providers: [ApiManagementService, ApiManagementUtilsService]
})
export class ApiManagementModule {}
