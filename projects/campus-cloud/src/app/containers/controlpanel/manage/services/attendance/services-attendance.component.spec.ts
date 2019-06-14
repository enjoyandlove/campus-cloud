import { HttpClientModule, HttpParams } from '@angular/common/http';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CPSession } from '@app/session';
import { RootStoreModule } from '@app/store';
import { mockSchool } from '@app/session/mock';
import { IDateRange } from '@shared/components';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { MockServicesService } from '../tests/mock';
import { ServicesService } from '../services.service';
import mockSession from '@campus-cloud/src/app/session/mock/session';
import { ServicesUtilsService } from '../services.utils.service';
import { ProvidersUtilsService } from '../providers.utils.service';
import { ServicesAttendanceComponent } from './services-attendance.component';

const school = mockSchool;

@Component({ selector: 'cp-providers-list', template: '' })
class ServicesProvidersListStubComponent {
  doDateFilter(dateRange: IDateRange) {
    return dateRange;
  }
}

describe('ServicesAttendanceComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ServicesAttendanceComponent, ServicesProvidersListStubComponent],
        imports: [HttpClientModule, RouterTestingModule, RootStoreModule],
        providers: [
          FormBuilder,
          CPI18nService,
          ServicesUtilsService,
          ProvidersUtilsService,
          {
            provide: CPSession,
            useValue: mockSession
          },
          {
            provide: ServicesService,
            useClass: MockServicesService
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: ServicesAttendanceComponent;
  let fixture: ComponentFixture<ServicesAttendanceComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesAttendanceComponent);
    component = fixture.componentInstance;

    component.loading = false;
    fixture.detectChanges();
  });

  it('should change dates and get service with dates', () => {
    const schoolId = school.id;
    const start = 1541131200;
    const end = 1541217599;
    const label = 'label';
    const dateRange: IDateRange = {
      start,
      end,
      label
    };
    spyOn(component, 'onDateFilter').and.callThrough();
    spyOn(component.serviceService, 'getServiceAttendanceSummary').and.callThrough();

    component.serviceId = 11997;
    component.onDateFilter(dateRange);

    const search = new HttpParams()
      .append('school_id', schoolId.toString())
      .append('start', start.toString())
      .append('end', end.toString());

    expect(component.serviceService.getServiceAttendanceSummary).toHaveBeenCalledWith(
      component.serviceId,
      search
    );
  });
});
