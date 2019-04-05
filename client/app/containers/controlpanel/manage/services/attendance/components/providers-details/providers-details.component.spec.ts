import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { CPSession } from '@app/session';
import { RootStoreModule } from '@app/store';
import { mockSchool } from '@app/session/mock';
import { IDateRange } from '@shared/components';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import mockSession from '@app/session/mock/session';
import { MockProvidersService } from '../../tests/mock';
import { MockServicesService } from '../../../tests/mock';
import { ServicesService } from '../../../services.service';
import { ProvidersService } from '../../../providers.service';
import { ServicesUtilsService } from '../../../services.utils.service';
import { ProvidersUtilsService } from '../../../providers.utils.service';
import { ServicesProviderDetailsComponent } from './providers-details.component';

const school = mockSchool;

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
          },
          {
            provide: ProvidersService,
            useClass: MockProvidersService
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
      spyOn(component.providersService, 'getProviderByProviderId').and.callThrough();

      component.serviceId = 11997;
      component.providerId = 545;
      component.loading = false;
      fixture.detectChanges();
      tick();

      component.onDateFilter(dateRange);
      const search = new HttpParams()
        .append('service_id', component.serviceId)
        .append('school_id', schoolId.toString())
        .append('start', start.toString())
        .append('end', end.toString());

      expect(component.onDateFilter).toHaveBeenCalledWith(dateRange);
      expect(component.providersService.getProviderByProviderId).toHaveBeenCalledWith(
        component.providerId,
        search
      );
    })
  );
});
