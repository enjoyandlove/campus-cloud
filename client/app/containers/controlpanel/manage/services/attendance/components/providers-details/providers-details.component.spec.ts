import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { IDateRange } from '../providers-action-box';
import { CPSession } from '../../../../../../../session';
import { ServicesService } from '../../../services.service';
import { RootStoreModule } from '../../../../../../../store';
import { ProvidersService } from '../../../providers.service';
import { CPI18nService } from '../../../../../../../shared/services';
import { configureTestSuite } from '../../../../../../../shared/tests';
import { ServicesUtilsService } from '../../../services.utils.service';
import { ServicesProviderDetailsComponent } from './providers-details.component';

class MockService {
  getServiceById(serviceId, start, end) {
    return of({ serviceId, start, end });
  }
}

class MockServiceProvider {
  getProviderByProviderId(serviceId, search: HttpParams) {
    return of({ serviceId, search });
  }
}

@Component({ selector: 'cp-providers-attendees-list', template: '' })
class ServicesProvidersAttendeesListStubComponent {
  doDateFilter(dateRange: IDateRange) {
    return dateRange;
  }
}

describe('ServicesProviderDetailsComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [
          ServicesProviderDetailsComponent,
          ServicesProvidersAttendeesListStubComponent
        ],
        imports: [HttpClientModule, RouterTestingModule, RootStoreModule],
        providers: [
          CPSession,
          CPI18nService,
          ServicesUtilsService,
          {
            provide: ServicesService,
            useClass: MockService
          },
          {
            provide: ProvidersService,
            useClass: MockServiceProvider
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let component: ServicesProviderDetailsComponent;
  let fixture: ComponentFixture<ServicesProviderDetailsComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesProviderDetailsComponent);
    component = fixture.componentInstance;

    component.loading = false;
    fixture.detectChanges();
  });

  it(
    'should change dates and get service with dates',
    fakeAsync(() => {
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
      spyOn(component.providersService, 'getProviderByProviderId').and.callThrough();

      component.serviceId = 11997;
      component.providerId = 545;
      component.loading = false;
      fixture.detectChanges();
      tick();

      component.onDateFilter(dateRange);
      const search = new HttpParams()
        .append('service_id', component.serviceId)
        .append('start', start.toString())
        .append('end', end.toString());

      expect(component.onDateFilter).toHaveBeenCalledWith(dateRange);
      expect(component.serviceService.getServiceById).toHaveBeenCalledWith(component.serviceId);
      expect(component.providersService.getProviderByProviderId).toHaveBeenCalledWith(
        component.providerId,
        search
      );
    })
  );
});
