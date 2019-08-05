import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ApiListComponent } from './list';

import {
  ApiManagementKeyComponent,
  ApiManagementTopbarComponent,
  ApiManagementHowToUseComponent
} from './components';

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

  imports: [CommonModule, SharedModule, ApiManagementRoutingModule],

  providers: [ApiManagementUtilsService]
})
export class ApiManagementModule {}
