import { async, TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FormBuilder } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { EventUtilService } from '../events.utils.service';
import { mockSchool } from '../../../../../session/mock/school';
import { EventsEditComponent } from './events-edit.component';
import { headerReducer, snackBarReducer } from '../../../../../reducers';
import { EventAttendance } from '../event.status';
import {
  AdminService,
  CPI18nService,
  ErrorService,
  StoreService
} from '../../../../../shared/services';

class MockService {
  dummy;

  updateEvent(body: any, eventId: number, search: any) {
    this.dummy = [eventId, search];

    return Observable.of({body});
  }

  getEventById(eventId: number, search: any) {
    this.dummy = [eventId, search];

    return Observable.of([]);
  }
}

describe('EventEditComponent', () => {
  let spy;
  let storeService;
  let service: EventsService;
  let component: EventsEditComponent;
  let fixture: ComponentFixture<EventsEditComponent>;

  const mockEvent = {
    'id': 1617104,
    'store_i': 2756,
    'city': '',
    'end': 1524110399,
    'title': 'Winter Term Intl Travel Session',
    'start': 1523851200,
    'location': 'WCC 2036 Milstein East B',
    'latitude': 0.0,
    'room_data': '',
    'description': 'TBD',
    'event_feedback': 0,
    'extra_data_id': 0,
    'address': '',
    'event_attendance': 0,
    'longitude': 0.0,
    'poster_url': 'https://d25cbba5lf1nun.cloudfront.net/AsmFS.png',
    'poster_thumb_url': 'https://d25cbba5lf1nun.cloudfront.net/AsmFSxT1V.png'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        EventsModule,
        RouterTestingModule,
        StoreModule.forRoot({
          HEADER: headerReducer,
          SNACKBAR: snackBarReducer
        })
      ],
      providers: [
        CPSession,
        FormBuilder,
        AdminService,
        ErrorService,
        StoreService,
        CPI18nService,
        EventUtilService,
        { provide: EventsService, useClass: MockService },
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(EventsEditComponent);
        service = TestBed.get(EventsService);
        storeService = TestBed.get(StoreService);

        component = fixture.componentInstance;
        component.eventId = 1002;
        component.session.g.set('school', mockSchool);

        component.ngOnInit();

        spyOn(component, 'router');
        spyOn(component, 'buildHeader');
        spyOn(component.service, 'getEventById').and.returnValue(Observable.of(mockEvent));
        spyOn(component.storeService, 'getStores').and.returnValue(Observable.of({}));
        spy = spyOn(component.service, 'updateEvent').and.returnValue(Observable.of({}));
      });
  }));

  it('should isAllDay be true', () => {
    component.onAllDayToggle(true);
    expect(component.form.controls['is_all_day'].value).toBeTruthy();
  });

  it('should have event manager tooltip', () => {
    const eventManager = component.cpI18n.translate('events_event_manager_tooltip');
    expect(component.eventManager.content).toEqual(eventManager);
  });

  it('should have attendance Manager tooltip', () => {
    const attendanceManager = component.cpI18n.translate('events_attendance_manager_tooltip');
    expect(component.attendanceManager.content).toEqual(attendanceManager);
  });

  it('should have student feedback tooltip', () => {
    const studentFeedback = component.cpI18n.translate('events_event_feedback_tooltip');
    expect(component.studentFeedback.content).toEqual(studentFeedback);
  });

  it('form validation should fail required fields missing', () => {
    component.form.controls['title'].setValue(null);
    component.form.controls['end'].setValue(null);
    component.form.controls['start'].setValue(null);
    component.form.controls['poster_url'].setValue(null);
    component.onSubmit(Observable.of({}));

    expect(component.form.valid).toBeFalsy();
    expect(component.formMissingFields).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('form validation should fail - event manager is required', () => {
    component.form.controls['event_attendance'].setValue(EventAttendance.enabled);
    component.onSubmit(Observable.of({}));

    expect(component.formMissingFields).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('form validation should fail - end date should be greater than start date', fakeAsync(() => {
    component.orientationId = 1001;
    component.isOrientation = true;
    const dateError = component.cpI18n.translate('events_error_end_date_before_start');
    component.fetch();
    tick();

    component.form.controls['end'].setValue(1492342527);
    component.onSubmit(Observable.of({}));

    expect(component.formMissingFields).toBeTruthy();
    expect(component.isDateError).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(component.dateErrorMessage).toEqual(dateError);
  }));

  it('form validation should fail - event end date should be in future', fakeAsync(() => {
    component.orientationId = 1001;
    component.isOrientation = true;
    const dateError = component.cpI18n.translate('events_error_end_date_after_now');
    component.fetch();
    tick();

    component.form.controls['start'].setValue(1460806527);
    component.form.controls['end'].setValue(1492342527);
    component.onSubmit(Observable.of({}));

    expect(component.formMissingFields).toBeTruthy();
    expect(component.isDateError).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(component.dateErrorMessage).toEqual(dateError);
  }));

  it('should edit an event', fakeAsync(() => {
    component.orientationId = 1001;
    component.isOrientation = true;
    component.fetch();
    tick();

    component.onSubmit(Observable.of({}));
    expect(spy).toHaveBeenCalled();
    expect(component.form.valid).toBeTruthy();
    expect(component.formMissingFields).toBeFalsy();
    expect(component.isDateError).toBeFalsy();
    expect(spy.calls.count()).toBe(1);
  }));
});
