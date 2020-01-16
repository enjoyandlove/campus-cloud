import { RouterTestingModule } from '@angular/router/testing';
import { ReadyUiModule } from '@ready-education/ready-ui';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CPSession } from '../../session';
import { ApiService } from '@campus-cloud/base/services';
import { EnvService, MockEnvService } from '@campus-cloud/config/env';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { SharedModule } from '@projects/campus-cloud/src/app/shared/shared.module';
@NgModule({
  providers: [
    CPSession,
    ApiService,
    CPI18nService,
    CPTrackingService,
    { provide: EnvService, useClass: MockEnvService }
  ],
  imports: [CommonModule, SharedModule, RouterTestingModule, HttpClientModule, ReadyUiModule],
  exports: [SharedModule, RouterTestingModule, HttpClientModule, ReadyUiModule]
})
export class CPTestModule {}
