import { ReadyUiModule } from '@ready-education/ready-ui';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { CPSession } from '../../session';
import { ApiService } from '@campus-cloud/base/services';
import { EnvService, MockEnvService } from '@campus-cloud/config/env';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
@NgModule({
  providers: [
    CPSession,
    ApiService,
    CPI18nService,
    CPTrackingService,
    { provide: EnvService, useClass: MockEnvService }
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterTestingModule,
    HttpClientModule,
    ReadyUiModule,
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {}
      }
    )
  ],
  exports: [SharedModule, RouterTestingModule, HttpClientModule, ReadyUiModule, StoreModule]
})
export class CPTestModule {}
