import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { EventsCreateComponent } from './events-create.component';
import { reducers } from '../../../../../reducers';
import { CPSession } from '../../../../../session';
import { mockSchool } from '../../../../../session/mock/school';
import {
  AdminService,
  CPI18nService,
  ErrorService,
  StoreService
} from '../../../../../shared/services';
import { EventAttendance, EventFeedback, isAllDay } from '../event.status';
import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { EventUtilService } from '../events.utils.service';

class MockService {
  dummy;

  createEvent(body: any, search: any) {
    this.dummy = [search];

    return observableOf({ body });
  }
}

describe('EventCreateComponent', () => {
  let spy;
  let component: EventsCreateComponent;
  let fixture: ComponentFixture<EventsCreateComponent>;

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
          fixture = TestBed.createComponent(EventsCreateComponent);

          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);
          component.ngOnInit();

          component.form = component.fb.group({
            title: ['This is Event title'],
            store_id: [2445],
            location: ['Otto mass chemistry building'],
            room_data: [802],
            city: ['Montreal'],
            province: [null],
            country: [null],
            address: [null],
            postal_code: ['H3A'],
            latitude: [component.school.latitude],
            longitude: [component.school.longitude],
            event_attendance: [EventAttendance.disabled],
            start: [1523851200],
            poster_url: ['image.jpeg'],
            poster_thumb_url: ['image.jpeg'],
            end: [1871304787],
            description: ['This is event description.'],
            event_feedback: [EventFeedback.enabled],
            event_manager_id: [null],
            attendance_manager_email: [null],
            custom_basic_feedback_label: [null],
            is_all_day: [isAllDay.disabled]
          });

          spyOn(component, 'router');
          spyOn(component, 'buildHeader');
          spy = spyOn(component.service, 'createEvent').and.returnValue(observableOf({}));
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
    const eventManager = component.cpI18n.translate('events_event_manager_tooltip');
    expect(component.utils.getToolTipContent('events_event_manager_tooltip')).toEqual(eventManager);
  });

  it('should have attendance Manager tooltip', () => {
    const attendanceManager = component.cpI18n.translate('events_attendance_manager_tooltip');
    expect(
      component.utils.getToolTipContent('events_attendance_manager_tooltip'))
      .toEqual(attendanceManager);

  });

  it('should have student feedback tooltip', () => {
    const studentFeedback = component.cpI18n.translate('events_event_feedback_tooltip');
    expect(
      component.utils.getToolTipContent('events_event_feedback_tooltip'))
      .toEqual(studentFeedback);

  });

  it('form validation should fail required fields missing', () => {
    component.form.controls['title'].setValue(null);
    component.form.controls['end'].setValue(null);
    component.form.controls['start'].setValue(null);
    component.form.controls['poster_url'].setValue(null);
    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    expect(component.formError).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('form validation should fail - event manager is required', () => {
    component.form.controls['event_attendance'].setValue(EventAttendance.enabled);
    component.onSubmit();

    expect(component.formError).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('form validation should fail - end date should be greater than start date', () => {
    const dateError = component.cpI18n.translate('events_error_end_date_before_start');

    component.form.controls['end'].setValue(1492342527);
    component.onSubmit();

    expect(component.formError).toBeTruthy();
    expect(component.isDateError).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(component.dateErrorMessage).toEqual(dateError);
  });

  it('form validation should fail - event end date should be in future', () => {
    const dateError = component.cpI18n.translate('events_error_end_date_after_now');

    component.form.controls['start'].setValue(1460806527);
    component.form.controls['end'].setValue(1492342527);
    component.onSubmit();

    expect(component.formError).toBeTruthy();
    expect(component.isDateError).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(component.dateErrorMessage).toEqual(dateError);
  });

  it('should create an event', () => {
    component.orientationId = 1001;

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.form.valid).toBeTruthy();
    expect(component.formError).toBeFalsy();
    expect(component.isDateError).toBeFalsy();
    expect(spy.calls.count()).toBe(1);
  });
});
