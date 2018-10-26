import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { EventsModule } from '../events.module';
import { EventAttendance } from '../event.status';
import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { EventUtilService } from '../events.utils.service';
import { EventsEditComponent } from './events-edit.component';
import { mockSchool } from '../../../../../session/mock/school';
import { baseReducers } from '../../../../../store/base/reducers';

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
    event_attendance: 1,
    longitude: 0.0,
    attend_verification_methods: [1, 2, 3],
    poster_url: 'https://d25cbba5lf1nun.cloudfront.net/AsmFS.png',
    poster_thumb_url: 'https://d25cbba5lf1nun.cloudfront.net/AsmFSxT1V.png'
  };

  const mockStore = [
    {
      label: '---',
      value: null
    }
  ];

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          HttpClientModule,
          EventsModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: baseReducers.HEADER,
            SNACKBAR: baseReducers.SNACKBAR
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
          component.isFormReady = true;
          component.ngOnInit();

          spyOn(component, 'buildHeader');
          spyOn(component.router, 'navigate');
          spyOn(component.service, 'getEventById').and.returnValue(observableOf(mockEvent));
          spyOn(component.storeService, 'getStores').and.returnValue(observableOf(mockStore));
          spy = spyOn(component.service, 'updateEvent').and.returnValue(observableOf({}));
          spyOn(component.router, 'navigate').and.returnValue(true);
        });
    })
  );

  it('should toggle is_all_day', () => {
    component.onAllDayToggle(true);
    expect(component.form.controls['is_all_day'].value).toBeTruthy();

    component.onAllDayToggle(false);
    expect(component.form.controls['is_all_day'].value).toBeFalsy();
  });

  it(
    'should have event attendance type tooltip',
    fakeAsync(() => {
      component.form.controls['event_attendance'].setValue(EventAttendance.enabled);
      fixture.detectChanges();
      tick();

      const toolTipInfoIcon = fixture.debugElement.query(
        By.css('.row .attendance-type-tooltip button')
      ).nativeElement;
      toolTipInfoIcon.click();
      tick();

      fixture.detectChanges();

      tick();
      const toolTipContent = fixture.debugElement.query(
        By.css('.row .attendance-type-tooltip .popover .popover-content div')
      ).nativeElement;

      const utilsEventAttendanceTypeTooltip = component.utils.getToolTipContent(
        't_events_event_attendance_type_tooltip'
      );

      expect(toolTipContent.textContent).toEqual(utilsEventAttendanceTypeTooltip.content);
    })
  );

  it(
    'should have event QR enabled tooltip',
    fakeAsync(() => {
      component.form.controls['event_attendance'].setValue(EventAttendance.enabled);
      fixture.detectChanges();
      tick();

      const toolTipInfoIcon = fixture.debugElement.query(
        By.css('.row .event-qr-enable-tooltip button')
      ).nativeElement;
      toolTipInfoIcon.click();
      tick();

      fixture.detectChanges();

      tick();
      const toolTipContent = fixture.debugElement.query(
        By.css('.row .event-qr-enable-tooltip .popover .popover-content div')
      ).nativeElement;

      const utilsEventQREnableTooltip = component.utils.getToolTipContent(
        't_events_event_qr_code_tooltip'
      );

      expect(toolTipContent.textContent).toEqual(utilsEventQREnableTooltip.content);
    })
  );

  it(
    'should have event manager tooltip',
    fakeAsync(() => {
      component.form.controls['event_attendance'].setValue(EventAttendance.enabled);
      fixture.detectChanges();
      tick();

      const toolTipInfoIcon = fixture.debugElement.query(
        By.css('.row .event-manager-tooltip button')
      ).nativeElement;
      toolTipInfoIcon.click();
      tick();

      fixture.detectChanges();

      tick();
      const toolTipContent = fixture.debugElement.query(
        By.css('.row .event-manager-tooltip .popover .popover-content div')
      ).nativeElement;

      const utilsEventManagerTooltip = component.utils.getToolTipContent(
        'events_event_manager_tooltip'
      );

      expect(toolTipContent.textContent).toEqual(utilsEventManagerTooltip.content);
    })
  );

  it(
    'should have attendance Manager tooltip',
    fakeAsync(() => {
      component.form.controls['event_attendance'].setValue(EventAttendance.enabled);
      fixture.detectChanges();
      tick();

      const toolTipInfoIcon = fixture.debugElement.query(
        By.css('.row .attendance-manager-tooltip button')
      ).nativeElement;
      toolTipInfoIcon.click();
      tick();

      fixture.detectChanges();

      tick();
      const toolTipContent = fixture.debugElement.query(
        By.css('.row .attendance-manager-tooltip .popover .popover-content div')
      ).nativeElement;

      const utilsAttendanceManagerTooltip = component.utils.getToolTipContent(
        'events_attendance_manager_tooltip'
      );

      expect(toolTipContent.textContent).toEqual(utilsAttendanceManagerTooltip.content);
    })
  );

  it(
    'should have student feedback tooltip',
    fakeAsync(() => {
      component.form.controls['event_attendance'].setValue(EventAttendance.enabled);
      fixture.detectChanges();
      tick();

      const toolTipInfoIcon = fixture.debugElement.query(
        By.css('.row .student-feedback-tooltip button')
      ).nativeElement;
      toolTipInfoIcon.click();
      tick();

      fixture.detectChanges();

      tick();
      const toolTipContent = fixture.debugElement.query(
        By.css('.row .student-feedback-tooltip .popover .popover-content div')
      ).nativeElement;

      const utilsStudentFeedbackTooltip = component.utils.getToolTipContent(
        'events_event_feedback_tooltip'
      );

      expect(toolTipContent.textContent).toEqual(utilsStudentFeedbackTooltip.content);
    })
  );

  it('form validation should fail required fields missing', () => {
    component.form.controls['title'].setValue(null);
    component.form.controls['end'].setValue(null);
    component.form.controls['start'].setValue(null);
    component.form.controls['poster_url'].setValue(null);
    component.form.controls['event_attendance'].setValue(EventAttendance.disabled);
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

      const eventEndDateBeforeStart = 1492342527;

      component.form.controls['end'].setValue(eventEndDateBeforeStart);
      component.form.controls['event_attendance'].setValue(EventAttendance.disabled);
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

      const eventStartDate = 1460806527;
      const eventEndDateInPast = 1492342527;

      component.form.controls['start'].setValue(eventStartDate);
      component.form.controls['end'].setValue(eventEndDateInPast);
      component.form.controls['event_attendance'].setValue(EventAttendance.disabled);
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

      component.form.controls['event_attendance'].setValue(EventAttendance.disabled);

      component.onSubmit(component.form.value);
      expect(spy).toHaveBeenCalled();
      expect(component.form.valid).toBeTruthy();
      expect(component.formMissingFields).toBeFalsy();
      expect(component.isDateError).toBeFalsy();
      expect(spy.calls.count()).toBe(1);
    })
  );
});
