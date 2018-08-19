import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { EventsEditComponent } from './events-edit.component';
import { reducers } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import {
  AdminService,
  CPI18nService,
  ErrorService,
  StoreService
} from '../../../../../shared/services';
import { EventAttendance } from '../event.status';
import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { EventUtilService } from '../events.utils.service';

class MockService {
  dummy;

  updateEvent(body: any, eventId: number, search: any) {
    this.dummy = [eventId, search];

    return observableOf({ body });
  }

  getEventById(eventId: number, search: any) {
    this.dummy = [eventId, search];

    return observableOf([]);
  }
}

describe('EventEditComponent', () => {
  let spy;
  let component: EventsEditComponent;
  let fixture: ComponentFixture<EventsEditComponent>;

  const mockEvent = {
    id: 1617104,
    store_i: 2756,
    city: '',
    end: 1871304787,
    title: 'Winter Term Intl Travel Session',
    start: 1523851200,
    location: 'WCC 2036 Milstein East B',
    latitude: 0.0,
    room_data: '',
    description: 'TBD',
    event_feedback: 0,
    extra_data_id: 0,
    address: '',
    event_attendance: 0,
    longitude: 0.0,
    poster_url: 'https://d25cbba5lf1nun.cloudfront.net/AsmFS.png',
    poster_thumb_url: 'https://d25cbba5lf1nun.cloudfront.net/AsmFSxT1V.png'
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          EventsModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: reducers.HEADER,
            SNACKBAR: reducers.SNACKBAR
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
          { provide: EventsService, useClass: MockService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(EventsEditComponent);

          component = fixture.componentInstance;
          component.eventId = 1002;
          component.session.g.set('school', mockSchool);

          component.ngOnInit();

          spyOn(component, 'router');
          spyOn(component, 'buildHeader');
          spyOn(component.service, 'getEventById').and.returnValue(observableOf(mockEvent));
          spyOn(component.storeService, 'getStores').and.returnValue(observableOf({}));
          spy = spyOn(component.service, 'updateEvent').and.returnValue(observableOf({}));
        });
    })
  );

  it('should toggle is_all_day', () => {
    component.onAllDayToggle(true);
    expect(component.form.controls['is_all_day'].value).toBeTruthy();

    component.onAllDayToggle(false);
    expect(component.form.controls['is_all_day'].value).toBeFalsy();
  });

  it('should have event manager tooltip', () => {
    const utilsEventManagerTooltip = component.utils
      .getToolTipContent('events_event_manager_tooltip');

    const eventManagerTooltip = component.cpI18n
      .translate('events_event_manager_tooltip');

    expect(utilsEventManagerTooltip.content).toEqual(eventManagerTooltip);
  });

  it('should have attendance Manager tooltip', () => {
    const utilsAttendanceManagerTooltip = component.utils
      .getToolTipContent('events_attendance_manager_tooltip');

    const attendanceManagerTooltip = component.cpI18n
      .translate('events_attendance_manager_tooltip');

    expect(utilsAttendanceManagerTooltip.content).toEqual(attendanceManagerTooltip);
  });

  it('should have student feedback tooltip', () => {
    const utilsStudentFeedbackTooltip = component.utils
      .getToolTipContent('events_event_feedback_tooltip');

    const studentFeedbackTooltip = component.cpI18n
      .translate('events_event_feedback_tooltip');

    expect(utilsStudentFeedbackTooltip.content).toEqual(studentFeedbackTooltip);
  });

  it('form validation should fail required fields missing', () => {
    component.form.controls['title'].setValue(null);
    component.form.controls['end'].setValue(null);
    component.form.controls['start'].setValue(null);
    component.form.controls['poster_url'].setValue(null);
    component.onSubmit(observableOf({}));

    expect(component.form.valid).toBeFalsy();
    expect(component.formMissingFields).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('form validation should fail - event manager is required', () => {
    component.form.controls['event_attendance'].setValue(EventAttendance.enabled);
    component.onSubmit(observableOf({}));

    expect(component.formMissingFields).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it(
    'form validation should fail - end date should be greater than start date',
    fakeAsync(() => {
      component.orientationId = 1001;
      component.isOrientation = true;
      const dateError = component.cpI18n.translate('events_error_end_date_before_start');
      component.fetch();
      tick();

      component.form.controls['end'].setValue(1492342527);
      component.onSubmit(observableOf({}));

      expect(component.formMissingFields).toBeTruthy();
      expect(component.isDateError).toBeTruthy();
      expect(component.buttonData.disabled).toBeFalsy();
      expect(component.dateErrorMessage).toEqual(dateError);
    })
  );

  it(
    'form validation should fail - event end date should be in future',
    fakeAsync(() => {
      component.orientationId = 1001;
      component.isOrientation = true;
      const dateError = component.cpI18n.translate('events_error_end_date_after_now');
      component.fetch();
      tick();

      component.form.controls['start'].setValue(1460806527);
      component.form.controls['end'].setValue(1492342527);
      component.onSubmit(observableOf({}));

      expect(component.formMissingFields).toBeTruthy();
      expect(component.isDateError).toBeTruthy();
      expect(component.buttonData.disabled).toBeFalsy();
      expect(component.dateErrorMessage).toEqual(dateError);
    })
  );

  it(
    'should edit an event',
    fakeAsync(() => {
      component.orientationId = 1001;
      component.isOrientation = true;
      component.fetch();
      tick();

      component.onSubmit(observableOf({}));
      expect(spy).toHaveBeenCalled();
      expect(component.form.valid).toBeTruthy();
      expect(component.formMissingFields).toBeFalsy();
      expect(component.isDateError).toBeFalsy();
      expect(spy.calls.count()).toBe(1);
    })
  );
});
