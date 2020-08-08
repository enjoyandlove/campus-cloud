import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { mockDateRange } from '@controlpanel/contact-trace/qr/tests/mock';
import { CPSession } from '@campus-cloud/session';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { ApiService } from '@campus-cloud/base/services';
import mockSession from '@campus-cloud/session/mock/session';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { EnvService, MockEnvService } from '@campus-cloud/config/env';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { QrListActionBoxComponent } from './list-action-box.component';
import { EngagementService } from '@controlpanel/assess/engagement/engagement.service';
import {
  IDateFilter,
  EngagementUtilsService
} from '@controlpanel/assess/engagement/engagement.utils.service';

@Component({ selector: 'cp-range-picker', template: '' })
export class CPRangePickerStubComponent {}

describe('QrListActionBoxComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      /**
       * do not import CPTestModule, this will
       * result in an error trying to resolve `cp-range-picker`
       */
      await TestBed.configureTestingModule({
        declarations: [QrListActionBoxComponent, CPRangePickerStubComponent, CPI18nPipe],
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

  let component: QrListActionBoxComponent;
  let fixture: ComponentFixture<QrListActionBoxComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrListActionBoxComponent);
    component = fixture.componentInstance;
  });

  it('should emit date range', () => {
    const spy = spyOn(component.filterByDates, 'emit');
    component.onDateChange(mockDateRange);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(mockDateRange);
  });

  it('should emit custom date range', () => {
    const spy = spyOn(component.filterByDates, 'emit');
    const customRange: IDateFilter = {
      route_id: 'route_id',
      label: 'label',
      payload: {
        metric: 'metrick',
        range: {
          start: 1,
          end: 2
        }
      }
    };
    component.onDateChange(customRange);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(mockDateRange);
  });
});
