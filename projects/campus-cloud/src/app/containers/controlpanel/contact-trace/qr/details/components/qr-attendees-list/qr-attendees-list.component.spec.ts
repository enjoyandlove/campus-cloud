import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';

import { RootStoreModule } from '@campus-cloud/store';
import { mockSchool } from '@campus-cloud/session/mock';

import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

import {
  mockFilterState,
  serviceProviderAttendeesListSearch
} from '@controlpanel/manage/services/attendance/tests/utils';
import { ProvidersService } from '../../../../../manage/services/providers.service';
import { ServicesModule } from '../../../../../manage/services/services.module';
import { QrAttendeesListComponent } from './qr-attendees-list.component';
import { mockProvider } from '../../../../../manage/services/attendance/tests/mock';

class MockService {
  getProviderAssessments() {
    return of([]);
  }
}

describe('QrAttendeesListComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [],
        imports: [
          RouterTestingModule,
          ServicesModule,
          RootStoreModule,
          HttpClientModule,
          CPTestModule
        ],
        providers: [
          {
            provide: ProvidersService,
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

  let fixture: ComponentFixture<QrAttendeesListComponent>;
  let component: QrAttendeesListComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QrAttendeesListComponent);
    component = fixture.componentInstance;

    component.provider = mockProvider;

    const session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
  }));

  it('should get assessment with dates', () => {
    component.filterState = mockFilterState;
    const spy = spyOn(component.providersService, 'getProviderAssessments').and.returnValue(of({}));
    let search = serviceProviderAttendeesListSearch('1', component.provider, component.state);
    search = component.providerUtils.addSearchParams(search, component.filterState);

    component.fetchAllRecords();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  });

  it('should get all for download', () => {
    const spy = spyOn(component.providersService, 'getProviderAssessments').and.returnValue(of({}));
    let search = serviceProviderAttendeesListSearch('1', component.provider, component.state);
    search = component.providerUtils.addSearchParams(search, component.filterState);

    component.fetchAllRecords();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  });
});
