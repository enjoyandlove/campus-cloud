import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { IDateRange } from './components';
import { CPSession } from '../../../../../session';
import { ServicesService } from '../services.service';
import { RootStoreModule } from '../../../../../store';
import { CPI18nService } from '../../../../../shared/services';
import { configureTestSuite } from '../../../../../shared/tests';
import { ServicesUtilsService } from '../services.utils.service';
import { ServicesAttendanceComponent } from './services-attendance.component';

class MockService {
  getServiceById(serviceId, start, end) {
    return of({ serviceId, start, end });
  }
}

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
          CPSession,
          FormBuilder,
          CPI18nService,
          ServicesUtilsService,
          {
            provide: ServicesService,
            useClass: MockService
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
    const start = 1541131200;
    const end = 1541217599;
    const label = 'label';
    const dateRange: IDateRange = {
      start,
      end,
      label
    };
    spyOn(component, 'onDateFilter').and.callThrough();
    spyOn(component.serviceService, 'getServiceById').and.callThrough();

    component.serviceId = 11997;
    component.onDateFilter(dateRange);

    expect(component.serviceService.getServiceById).toHaveBeenCalledWith(
      component.serviceId,
      start,
      end
    );
  });
});
