import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { CPSession } from '../../../../session';
import { CheckinService } from '../checkin.service';
import { CallbackModule } from '../../callback.module';
import { baseReducers } from '../../../../store/base/reducers';
import { CheckinEventsComponent } from './checkin-events.component';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../shared/services/i18n.service';
import { CPTrackingService, ErrorService } from '../../../../shared/services';

class MockService {
  dummy;

  doEventCheckin(data: any, search: any) {
    this.dummy = [data, search];

    return observableOf({});
  }
}

xdescribe('CheckinEventsComponent', () => {
  let spy;
  let events;
  let sourceId;
  let eventProperties;
  let component: CheckinEventsComponent;
  let fixture: ComponentFixture<CheckinEventsComponent>;

  beforeEach(
    async(() => {
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
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(CheckinEventsComponent);
          component = fixture.componentInstance;
          component.eventId = '47588';

          spy = spyOn(component.checkinService, 'doEventCheckin').and.returnValue(observableOf({}));
        });
    })
  );

  it('trackCheckedInEvent', () => {
    sourceId = 8874;
    events = {
      store_category: 16,
      has_checkout: false,
      checkin_verification_methods: [1, 2, 3]
    };

    eventProperties = component.utils.getCheckedInEventProperties(
      sourceId,
      events
    );

    expect(eventProperties.source_id).toEqual(sourceId);
    expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.ENABLED);
    expect(eventProperties.check_out_status).toEqual(amplitudeEvents.DISABLED);
    expect(eventProperties.assessment_type).toEqual(amplitudeEvents.SERVICE_PROVIDER);

    sourceId = 8547;
    events = {
      store_category: 0,
      has_checkout: true,
      attend_verification_methods: [1, 2]
    };

    eventProperties = component.utils.getCheckedInEventProperties(
      sourceId,
      events,
      true
    );

    expect(eventProperties.source_id).toEqual(sourceId);
    expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.DISABLED);
    expect(eventProperties.check_out_status).toEqual(amplitudeEvents.ENABLED);
    expect(eventProperties.assessment_type).toEqual(amplitudeEvents.INSTITUTION_EVENT);
  });

  it('Should add event check-in', () => {
    component.search = new HttpParams().append('event_id', component.eventId);

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
