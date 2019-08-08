import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { HttpParams } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { mockFilter } from '../../tests/mock';
import { CPSession } from '@campus-cloud/session';
import { ServicesModule } from '../../../services.module';
import { ProvidersService } from '../../../providers.service';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { mockUser } from '@projects/campus-cloud/src/app/session/mock';
import { ServicesUtilsService } from '../../../services.utils.service';
import { ProvidersUtilsService } from '../../../providers.utils.service';
import { ServicesProvidersListComponent } from './providers-list.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

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

describe('ProvidersListComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, ServicesModule, RouterTestingModule],
        providers: [
          provideMockStore(),
          ServicesUtilsService,
          ProvidersUtilsService,
          { provide: ProvidersService, useClass: MockService }
        ]
      });
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let assessSpy;
  let session: CPSession;
  let component: ServicesProvidersListComponent;
  let fixture: ComponentFixture<ServicesProvidersListComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesProvidersListComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    component.service = {
      ...component.service,
      id: 123
    };

    component.state = {
      ...component.state,
      providers: mockProvider
    };

    spyOn(component.hasProviders, 'emit');

    assessSpy = spyOn(component.providersService, 'getProviderAssessments').and.returnValue(
      observableOf({})
    );

    spy = spyOn(component.providersService, 'getProviders').and.returnValue(
      observableOf(mockProvider)
    );
  }));

  it('should sort headers', () => {
    component.doSort('provider_name');

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.state.sort_field).toEqual('provider_name');
  });

  it('should search on filter change', () => {
    component.filterState = mockFilter;

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
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

  it('should set hasRecords', fakeAsync(() => {
    component.fetch(true);

    tick();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);

    expect(component.hasRecords).toBe(true);

    expect(component.hasProviders.emit).toHaveBeenCalled();
    expect(component.hasProviders.emit).toHaveBeenCalledWith(true);
    expect(component.hasProviders.emit).toHaveBeenCalledTimes(1);
  }));

  it('should get all for download', () => {
    let search = new HttpParams()
      .set('service_id', component.service.id.toString())
      .set('all', '1');
    search = component.providerUtils.addSearchParams(search, component.filterState);

    component.downloadProvidersCSV();

    expect(assessSpy).toHaveBeenCalledTimes(1);
    expect(assessSpy).toHaveBeenCalledWith(component.startRange, component.endRange, search);
  });
});
