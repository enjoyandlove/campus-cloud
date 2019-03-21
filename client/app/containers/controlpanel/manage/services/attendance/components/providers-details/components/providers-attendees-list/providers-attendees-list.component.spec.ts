import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@app/session';
import { RootStoreModule } from '@app/store';
import { CPI18nService } from '@shared/services';
import { configureTestSuite } from '@shared/tests';
import { mkSearch } from '../../../../tests/utils';
import { mockProvider } from '../../../../tests/mock';
import { ServicesModule } from '../../../../../services.module';
import { ProvidersService } from '../../../../../providers.service';
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
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      spyOn(component.providersService, 'getProviderAssessments').and.callThrough();
      component.state.start = '1';
      component.state.end = '2';
      component.fetchAllRecords();
      const search = mkSearch('1', component.provider)
        .append('end', component.state.end)
        .append('start', component.state.start);
      expect(component.providersService.getProviderAssessments).toHaveBeenCalledWith(
        1,
        101,
        search
      );
    });
  });

  it('should get all for download', () => {
    const spy = spyOn(component.providersService, 'getProviderAssessments').and.returnValue(of({}));
    let search = new HttpParams()
      .set('service_id', component.provider.campus_service_id.toString())
      .set('service_provider_id', component.provider.id.toString())
      .set('sort_field', component.state.sort_field)
      .set('sort_direction', component.state.sort_direction)
      .set('all', '1');
    search = component.providerUtils.addSearchParams(search, component.filterState);

    component.fetchAllRecords();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  });
});
