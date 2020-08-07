import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ApiService } from '@campus-cloud/base';
import { CPSession } from '@campus-cloud/session';

import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import mockSession from '@campus-cloud/session/mock/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { EnvService, MockEnvService } from '@campus-cloud/config/env';
import { EngagementService } from '@controlpanel/assess/engagement/engagement.service';

import {
  IDateFilter,
  EngagementUtilsService
} from '@controlpanel/assess/engagement/engagement.utils.service';
import { QrAttendeesActionBoxComponent } from './qr-attendees-action-box.component';
import { mockDateRange } from '../../../../../manage/services/attendance/tests/mock';

@Component({ selector: 'cp-range-picker', template: '' })
export class CPRangePickerStubComponent {}

describe('QrActionBoxComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        declarations: [QrAttendeesActionBoxComponent, CPRangePickerStubComponent, CPI18nPipe],
        imports: [HttpClientModule, RouterTestingModule],
        providers: [
          ApiService,
          CPI18nService,
          EngagementService,
          EngagementUtilsService,
          { provide: EnvService, useClass: MockEnvService },
          {
            provide: CPSession,
            useValue: mockSession
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: QrAttendeesActionBoxComponent;
  let fixture: ComponentFixture<QrAttendeesActionBoxComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrAttendeesActionBoxComponent);
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
        metric: 'metric',
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
