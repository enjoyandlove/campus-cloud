import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { FormBuilder } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { EventsModule } from '../events.module';
import { EventsService } from '../events.service';
import { EventAttendance } from '../event.status';
import { CPSession } from '../../../../../session';
import { EventUtilService } from '../events.utils.service';
import { mockSchool } from '../../../../../session/mock/school';
import { EventsCreateComponent } from './events-create.component';
import { baseReducers } from '../../../../../store/base/reducers';

import {
  AdminService,
  CPI18nService,
  ErrorService,
  StoreService
} from '../../../../../shared/services';
import { CPDate } from '../../../../../shared/utils';

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
          fixture = TestBed.createComponent(EventsCreateComponent);

          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);
          component.attendance = true;

          fixture.detectChanges();

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

  it(
    'should have event attendance type tooltip',
    fakeAsync(() => {
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

    // required fields
    component.form.controls['title'].setValue('hello');
    component.form.controls['poster_url'].setValue('hello');
    component.form.controls['poster_thumb_url'].setValue('hello');
    component.form.controls['store_id'].setValue(1);
    const future = CPDate.now(component.session.tz)
      .add(1, 'day')
      .unix();
    const now = CPDate.now(component.session.tz).unix();
    component.form.controls['end'].setValue(now);
    component.form.controls['start'].setValue(future);

    component.onSubmit();

    expect(component.formError).toBeTruthy();
    expect(component.isDateError).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(component.dateErrorMessage).toEqual(dateError);
  });

  it('form validation should fail - event end date should be in future', () => {
    // required fields
    component.form.controls['title'].setValue('hello');
    component.form.controls['poster_url'].setValue('hello');
    component.form.controls['poster_thumb_url'].setValue('hello');
    component.form.controls['store_id'].setValue(1);

    component.form.controls['start'].setValue(1492342527);
    component.form.controls['end'].setValue(1460806527);

    component.onSubmit();

    expect(component.formError).toBeTruthy();
    expect(component.isDateError).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('should create an event', () => {
    const future = CPDate.now(component.session.tz)
      .add(1, 'day')
      .unix();
    const now = CPDate.now(component.session.tz).unix();

    component.form.controls['title'].setValue('hello');
    component.form.controls['poster_url'].setValue('hello');
    component.form.controls['poster_thumb_url'].setValue('hello');
    component.form.controls['store_id'].setValue(1);

    component.form.controls['start'].setValue(now);
    component.form.controls['end'].setValue(future);

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.form.valid).toBeTruthy();
    expect(component.formError).toBeFalsy();
    expect(component.isDateError).toBeFalsy();
  });
});
