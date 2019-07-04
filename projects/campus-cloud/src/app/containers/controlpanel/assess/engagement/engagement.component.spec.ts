import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { Router } from '@angular/router';

import { CPSession } from '@campus-cloud/session';
import { baseActions } from '@campus-cloud/store/base';
import { EngagementService } from './engagement.service';
import { mockUser } from '@campus-cloud/session/mock/user';
import { EngagementComponent } from './engagement.component';
import { AssessUtilsService } from '../assess.utils.service';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { baseReducers } from '@campus-cloud/store/base/reducers';
import { CPLineChartUtilsService } from '@campus-cloud/shared/components/cp-line-chart/cp-line-chart.utils.service';
import {
  CPI18nService,
  CPTrackingService,
  CPAmplitudeService
} from '@campus-cloud/shared/services';

const mockFilterState = {
  engagement: {
    route_id: 'all',
    label: 'All Engagements',
    data: {
      type: null,
      value: 0,
      queryParam: 'scope'
    }
  },
  for: {
    route_id: 'all_students',
    label: 'All Students',
    listId: null
  },
  range: {
    route_id: 'last_week',
    label: 'Last 7 Days',
    payload: {
      metric: 'daily',
      range: {
        end: 1508180917,
        start: 1507608000
      }
    }
  }
};

class MockEngagementService {
  getChartData() {
    return observableOf('hello');
  }
}

class MockSession {
  g = new Map();

  get tz() {
    return 'America/Toronto';
  }
}

class MockRouter {
  navigate(url: string) {
    return url;
  }
}

describe('EngagementComponent', () => {
  let storeSpy;
  let store: Store<any>;
  // let session: CPSession;
  let component: EngagementComponent;
  let fixture: ComponentFixture<EngagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // EngagementModule,
        StoreModule.forRoot({
          HEADER: baseReducers.HEADER,
          SNACKBAR: baseReducers.SNACKBAR
        })
      ],
      declarations: [EngagementComponent],
      providers: [
        CPI18nService,
        CPAmplitudeService,
        CPTrackingService,
        AssessUtilsService,
        CPLineChartUtilsService,
        { provide: Router, useClass: MockRouter },
        { provide: CPSession, useClass: MockSession },
        { provide: EngagementService, useClass: MockEngagementService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(EngagementComponent, {
      set: {
        template: '<div>No need of child components</div>'
      }
    });

    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(EngagementComponent);
    component = fixture.componentInstance;

    component.session.g.set('user', mockUser);
    component.session.g.set('school', mockSchool);

    fixture.detectChanges();
  });

  it('onDoCompose', () => {
    const expected = { to: 'me', message: 'hello world' };

    expect(component.messageData).not.toBeDefined();
    expect(component.isComposeModal).toBeFalsy();

    component.onDoCompose(expected);

    expect(component.isComposeModal).toBeTruthy();
    expect(component.messageData).toEqual(expected);
  });

  it('onFlashMessage', () => {
    spyOn(component, 'trackMessageEvent');
    component.onFlashMessage(null);

    const expected = {
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: component.cpI18n.translate('announcement_success_sent'),
        autoClose: true
      }
    };
    expect(storeSpy).toHaveBeenCalledWith(expected);
  });

  it('ngOnInit', () => {
    component.ngOnInit();

    const expected = {
      type: baseActions.HEADER_UPDATE,
      payload: require('../assess.header.json')
    };
    expect(storeSpy).toHaveBeenCalledWith(expected);
  });

  it('onComposeTeardown', () => {
    component.onComposeTeardown();

    expect(component.isComposeModal).toBeFalsy();
    expect(component.messageData).toBeNull();
  });

  xit('buildSearchHeaders', () => {
    component.onDoFilter(mockFilterState);
    fixture.detectChanges();
  });
});
