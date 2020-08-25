import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CasesComponent } from '../../../cases.component';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';
import { ApiService } from '@projects/campus-cloud/src/app/base';
import { CPI18nService, CPTrackingService } from '@projects/campus-cloud/src/app/shared/services';
import { EngagementService } from '../../../../../assess/engagement/engagement.service';
import { EngagementUtilsService } from '../../../../../assess/engagement/engagement.utils.service';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import mockSession from '@projects/campus-cloud/src/app/session/mock/session';
import { EnvService, MockEnvService } from '@projects/campus-cloud/src/app/config/env';
import { configureTestSuite } from '@projects/campus-cloud/src/app/shared/tests';
import { CasesListActionBoxComponent } from './list-action-box.component';

@Component({ selector: 'cp-range-picker', template: '' })
export class CPRangePickerStubComponent {}

describe('CasesListActionBoxComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      /**
       * do not import CPTestModule, this will
       * result in an error trying to resolve `cp-range-picker`
       */
      await TestBed.configureTestingModule({
        declarations: [CasesListActionBoxComponent, CPRangePickerStubComponent, CPI18nPipe],
        imports: [HttpClientModule, RouterTestingModule],
        providers: [
          ApiService,
          CPI18nService,
          CPTrackingService,
          EngagementService,
          EngagementUtilsService,
          {
            provide: CPSession,
            useValue: mockSession
          },
          { provide: EnvService, useClass: MockEnvService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: CasesListActionBoxComponent;
  let fixture: ComponentFixture<CasesListActionBoxComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CasesListActionBoxComponent);
    component = fixture.componentInstance;
  });
});
