import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { CPSession } from '../../../../session';
import { CheckinService } from '../checkin.service';
import { CallbackModule } from '../../callback.module';
import { configureTestSuite } from '../../../../shared/tests';
import { baseReducers } from '../../../../store/base/reducers';
import { CheckinServiceComponent } from './checkin-service.component';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../shared/services/i18n.service';
import { CPTrackingService, ErrorService } from '../../../../shared/services';
import { CheckInSource } from '../../../controlpanel/manage/events/event.status';

class MockService {
  dummy;

  doServiceCheckin(data: any, search: any) {
    this.dummy = [data, search];

    return observableOf({});
  }
}

describe('CheckinServiceComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [
          CallbackModule,
          HttpClientModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: baseReducers.HEADER,
            SNACKBAR: baseReducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          ErrorService,
          CPI18nService,
          CheckinService,
          CPTrackingService,
          { provide: CheckinService, useClass: MockService }
        ]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  describe('CheckinServiceComponent', () => {
    let spy;
    let userId;
    let services;
    let sourceId;
    let checkInSource;
    let eventProperties;
    let component: CheckinServiceComponent;
    let fixture: ComponentFixture<CheckinServiceComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(CheckinServiceComponent);
      component = fixture.componentInstance;
      component.serviceId = '47588';

      spy = spyOn(component.checkinService, 'doServiceCheckin')
        .and.returnValue(observableOf({}));
    });

    it('trackCheckedInEvent', () => {
      userId = 452;
      sourceId = 8874;
      checkInSource = CheckInSource.services;
      services = {
        has_checkout: false,
        checkin_verification_methods: [1, 2, 3]
      };

      eventProperties = component.utils.getCheckedInEventProperties(
        sourceId,
        services,
        userId,
        checkInSource
      );

      expect(eventProperties.user_id).toEqual(userId);
      expect(eventProperties.source_id).toEqual(sourceId);
      expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.ENABLED);
      expect(eventProperties.check_out_status).toEqual(amplitudeEvents.DISABLED);
      expect(eventProperties.check_in_type).toEqual(amplitudeEvents.SERVICE_PROVIDER);

      userId = 154;
      sourceId = 8547;
      checkInSource = CheckInSource.events;
      services = {
        has_checkout: true,
        attend_verification_methods: [1, 2]
      };

      eventProperties = component.utils.getCheckedInEventProperties(
        sourceId,
        services,
        userId,
        checkInSource,
        true
      );

      expect(eventProperties.user_id).toEqual(userId);
      expect(eventProperties.source_id).toEqual(sourceId);
      expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.DISABLED);
      expect(eventProperties.check_out_status).toEqual(amplitudeEvents.ENABLED);
      expect(eventProperties.check_in_type).toEqual(amplitudeEvents.INSTITUTION_EVENT);
    });

    it('onSubmit', () => {
      component.search = new HttpParams().append('event_id', component.serviceId);

      const data = {
        firstname: 'Hello',
        lastname: 'World',
        email: 'hello@world.com',
        check_in_time_epoch: 525555485,
        check_out_time_epoch: 525555485
      };

      component.onSubmit(data);

      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(data, component.search);
    });
  });
});
