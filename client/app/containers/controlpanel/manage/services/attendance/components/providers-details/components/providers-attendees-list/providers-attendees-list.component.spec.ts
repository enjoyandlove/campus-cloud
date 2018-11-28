import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { mkSearch } from '../../../../tests/utils';
import { mockProvider } from '../../../../tests/mock';
import { CPSession } from '../../../../../../../../../session';
import { ServicesModule } from '../../../../../services.module';
import { RootStoreModule } from '../../../../../../../../../store';
import { ProvidersService } from '../../../../../providers.service';
import { CPI18nService } from '../../../../../../../../../shared/services';
import { configureTestSuite } from '../../../../../../../../../shared/tests';
import { ServicesProvidersAttendeesListComponent } from './providers-attendees-list.component';

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
        imports: [RouterTestingModule, ServicesModule, RootStoreModule, HttpClientModule],
        providers: [
          CPSession,
          CPI18nService,
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

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(ServicesProvidersAttendeesListComponent);
      component = fixture.componentInstance;

      component.provider = mockProvider;
    })
  );

  it('should get assessment with dates', () => {
    spyOn(component.providersService, 'getProviderAssessments').and.callThrough();
    component.state.start = '1';
    component.state.end = '2';
    component.fetchAllRecords();
    const search = mkSearch('1', component.provider)
      .append('end', component.state.end)
      .append('start', component.state.start);
    expect(component.providersService.getProviderAssessments).toHaveBeenCalledWith(1, 101, search);
  });

  it('should get assessment with search', () => {
    spyOn(component.providersService, 'getProviderAssessments').and.callThrough();
    component.state.search_text = 'search';
    component.fetchAllRecords();
    const search = mkSearch('1', component.provider).append(
      'search_text',
      component.state.search_text
    );
    expect(component.providersService.getProviderAssessments).toHaveBeenCalledWith(1, 101, search);
  });
});
