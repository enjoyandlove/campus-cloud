import { HttpClientModule, HttpParams } from '@angular/common/http';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CPSession } from '@campus-cloud/session';

import { ServicesService } from '@controlpanel/manage/services/services.service';
import { RootStoreModule } from '@campus-cloud/store';
import { CPI18nPipe } from '@campus-cloud/shared/pipes/i18n/i18n.pipe';
import { IDateRange } from '@campus-cloud/shared/components';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { ProvidersUtilsService } from '@controlpanel/manage/services/providers.utils.service';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { QrComponent } from './qr.component';
import { MockServicesService } from '@controlpanel/manage/services/tests';
import { QrListNoContentComponent } from './list/components';
import { CPI18nService } from '@projects/campus-cloud/src/app/shared/services/i18n.service';

@Component({ selector: 'cp-qr', template: '' })
class QrStubComponent {
  doDateFilter(dateRange: IDateRange) {
    return dateRange;
  }
}

describe('QrComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [QrComponent, QrStubComponent],
        imports: [HttpClientModule, RouterTestingModule, RootStoreModule, CPTestModule],
        providers: [
          FormBuilder,
          ServicesUtilsService,
          ProvidersUtilsService,
          CPI18nPipe,
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

  let session: CPSession;
  let component: QrComponent;
  let fixture: ComponentFixture<QrComponent>;
  let childFixture: ComponentFixture<QrListNoContentComponent>;
  let noContentComponent: QrListNoContentComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(QrComponent);
    component = fixture.componentInstance;
    session = TestBed.get(CPSession);

    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    component.loading = false;
    component.serviceId = session.g.get('school').ct_service_id;
    childFixture = TestBed.createComponent(QrListNoContentComponent);
    noContentComponent = childFixture.componentInstance;
    fixture.detectChanges();
  });

  it('should change dates and get service with dates', () => {
    const schoolId = mockSchool.id;
    const start = 1541131200;
    const end = 1541217599;
    const label = 'label';
    const dateRange: IDateRange = {
      start,
      end,
      label
    };
    spyOn(component, 'onDateFilter').and.callThrough();

    component.onDateFilter(dateRange);

    const search = new HttpParams()
      .append('school_id', schoolId.toString())
      .append('start', start.toString())
      .append('end', end.toString());
  });

  it(' should show no content in case of no providers ', () => {
    component.noProviders = true;
    expect(noContentComponent).toBeTruthy;
  });
});
