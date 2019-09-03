import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockProvider } from '../../../../tests/mock';
import { RootStoreModule } from '@campus-cloud/store';
import { mockSchool } from '@campus-cloud/session/mock';
import { ServicesModule } from '../../../../../services.module';
import { ProvidersService } from '../../../../../providers.service';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ServicesProvidersAttendeesListComponent } from './providers-attendees-list.component';
import {
  mockFilterState,
  serviceProviderAttendeesListSearch
} from '@controlpanel/manage/services/attendance/tests/utils';

class MockService {
  getProviderAssessments() {
    return of([]);
  }
}

describe('ServicesProvidersAttendeesListComponent', () => {
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

  let fixture: ComponentFixture<ServicesProvidersAttendeesListComponent>;
  let component: ServicesProvidersAttendeesListComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesProvidersAttendeesListComponent);
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
