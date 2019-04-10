import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CPSession } from '@app/session';
import { CPI18nPipe } from '@shared/pipes';
import { mockDateRange } from '../../tests/mock';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import mockSession from '@app/session/mock/session';
import { ServicesProviderActionBoxComponent } from './providers-action-box.component';
import { EngagementService } from '@controlpanel/assess/engagement/engagement.service';
import {
  IDateFilter,
  EngagementUtilsService
} from '@controlpanel/assess/engagement/engagement.utils.service';

@Component({ selector: 'cp-range-picker', template: '' })
export class CPRangePickerStubComponent {}

describe('ServicesProviderActionBoxComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      await TestBed.configureTestingModule({
        declarations: [ServicesProviderActionBoxComponent, CPRangePickerStubComponent, CPI18nPipe],
        imports: [HttpClientModule, RouterTestingModule],
        providers: [
          CPI18nService,
          EngagementService,
          EngagementUtilsService,
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

  let component: ServicesProviderActionBoxComponent;
  let fixture: ComponentFixture<ServicesProviderActionBoxComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesProviderActionBoxComponent);
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
