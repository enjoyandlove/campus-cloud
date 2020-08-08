import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { RootStoreModule } from '@campus-cloud/store';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

import { IDateRange } from '@campus-cloud/shared/components';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

import { QrDetailsComponent } from './qr-details.component';

import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';
import { ProvidersUtilsService } from '@controlpanel/manage/services/providers.utils.service';
import { ServicesService } from '@controlpanel/manage/services/services.service';
import { MockServicesService } from '@controlpanel/manage/services/tests/mock';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import { MockProvidersService } from '@controlpanel/manage/services/attendance/tests/mock';

const school = mockSchool;

@Component({ selector: 'cp-providers-attendees-list', template: '' })
class QrAttendeesListStubComponent {
  doDateFilter(dateRange: IDateRange) {
    return dateRange;
  }
}

describe('QrDetailsComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [QrDetailsComponent, QrAttendeesListStubComponent],
        imports: [CPTestModule, HttpClientModule, RouterTestingModule, RootStoreModule],
        providers: [
          CPI18nPipe,
          ServicesUtilsService,
          ProvidersUtilsService,
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

  let session: CPSession;
  let component: QrDetailsComponent;
  let fixture: ComponentFixture<QrDetailsComponent>;

  beforeEach(() => {
    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    fixture = TestBed.createComponent(QrDetailsComponent);
    component = fixture.componentInstance;
    component.loading = false;
    fixture.detectChanges();
  });

  it('should change dates and get service with dates', fakeAsync(() => {
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

    component.serviceId = 4869;
    component.providerId = 44140;
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
  }));
});
