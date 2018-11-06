import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { StoreModule } from '@ngrx/store';

import { CPSession } from '../../../../../../../session';
import { ServicesModule } from '../../../services.module';
import { ProvidersService } from '../../../providers.service';
import { CPI18nService } from '../../../../../../../shared/services';
import { configureTestSuite } from '../../../../../../../shared/tests';
import { ServicesUtilsService } from '../../../services.utils.service';
import { baseReducers } from '../../../../../../../store/base/reducers';
import { ServicesProvidersListComponent } from './providers-list.component';
import { CPTrackingService } from '../../../../../../../shared/services/tracking.service';

class MockService {
  dummy;

  getProviders(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return observableOf({});
  }

  getProviderAssessments(startRage: number, endRage: number, search: any) {
    this.dummy = [startRage, endRage, search];

    return observableOf({});
  }
}

const mockProvider = [
  {
    id: 12,
    img_url: '',
    num_ratings: 50,
    contactphone: '',
    encrypted_id: '',
    total_visits: 5,
    unique_visits: 2,
    provider_type: 0,
    campus_service_id: 123,
    avg_rating_percent: 50,
    has_checkout: false,
    has_feedback: true,
    encrypted_campus_service_id: '',
    provider_name: 'Hello World!',
    email: 'helloworld@gmail.com',
    checkin_verification_methods: [1, 2, 3],
    custom_basic_feedback_label: 'hello world'
  }
];

fdescribe('ProvidersListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          ServicesModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: baseReducers.HEADER,
            SNACKBAR: baseReducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          CPTrackingService,
          ServicesUtilsService,
          { provide: ProvidersService, useClass: MockService }
        ]
      });
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let component: ServicesProvidersListComponent;
  let fixture: ComponentFixture<ServicesProvidersListComponent>;

  beforeEach(
    async(() => {
      fixture = TestBed.createComponent(ServicesProvidersListComponent);
      component = fixture.componentInstance;

      component.service = {
        ...component.service,
        id: 123
      };

      component.state = {
        ...component.state,
        providers: mockProvider
      };

      spyOn(component.hasProviders, 'emit');

      spyOn(component.providersService, 'getProviderAssessments').and.returnValue(observableOf({}));

      spy = spyOn(component.providersService, 'getProviders').and.returnValue(
        observableOf(mockProvider)
      );
    })
  );

  it('should sort headers', () => {
    component.doSort('provider_name');

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.state.sort_field).toEqual('provider_name');
  });

  it('should search string', () => {
    component.doSearch('hello world');

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.state.search_text).toEqual('hello world');
  });

  it('should filter on date selection', () => {
    const dateRange = {
      start: '1540899640',
      end: '1540899650'
    };

    component.doDateFilter(dateRange);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.state.end).toEqual(dateRange.end);
    expect(component.state.start).toEqual(dateRange.start);
  });

  it('should delete record', () => {
    component.onDeleted(12);

    expect(component.state.providers.length).toBe(0);
    expect(component.hasProviders.emit).toHaveBeenCalled();
    expect(component.hasProviders.emit).toHaveBeenCalledTimes(1);
  });

  it('should edit record', () => {
    component.onEdited(mockProvider[0]);

    expect(component.provider).toBeNull();
    expect(component.showEditProviderModal).toBe(false);
    expect(component.state.providers[0].provider_name).toEqual('Hello World!');
    expect(component.state.providers[0].email).toEqual('helloworld@gmail.com');
  });

  it('should download csv', () => {
    component.downloadProvidersCSV();

    expect(component.providersService.getProviderAssessments).toHaveBeenCalled();
    expect(component.providersService.getProviderAssessments).toHaveBeenCalledTimes(1);
  });

  it(
    'should set hasRecords',
    fakeAsync(() => {
      component.fetch(true);

      tick();
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);

      expect(component.hasRecords).toBe(true);

      expect(component.hasProviders.emit).toHaveBeenCalled();
      expect(component.hasProviders.emit).toHaveBeenCalledWith(true);
      expect(component.hasProviders.emit).toHaveBeenCalledTimes(1);
    })
  );
});
