import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { EventsModule } from '../events.module';
import { EventAttendance } from '../event.status';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { EventUtilService } from '../events.utils.service';
import { fillForm } from '@campus-cloud/shared/utils/tests';
import { AdminService } from '@campus-cloud/shared/services';
import { filledForm } from '@controlpanel/manage/events/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EventsCreateComponent } from './events-create.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('EventCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, EventsModule, HttpClientModule, RouterTestingModule],
        providers: [AdminService, EventUtilService, provideMockStore()],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let session;
  let component: EventsCreateComponent;
  let fixture: ComponentFixture<EventsCreateComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventsCreateComponent);

    component = fixture.componentInstance;
    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();

    spyOn(component, 'buildHeader');
    spyOn(component, 'handleError');
    spyOn(component.router, 'navigate');
    spy = spyOn(component.service, 'createEvent').and.returnValue(of({}));
  }));

  describe('FORM VALIDATION', () => {
    it('form validation should fail required fields missing', () => {
      const errorMessage = component.cpI18n.translate('error_fill_out_marked_fields');

      fillForm(component.form, filledForm);

      component.form.get('title').setValue(null);
      component.onSubmit();

      expect(component.formError).toBe(true);
      expect(component.form.valid).toBe(false);
      expect(component.buttonData.disabled).toBe(false);
      expect(component.handleError).toHaveBeenCalledWith(errorMessage);
    });

    it('form validation should fail - event manager is required', () => {
      component.form.get('event_attendance').setValue(EventAttendance.enabled);

      component.onSubmit();

      expect(component.formError).toBe(true);
      expect(component.buttonData.disabled).toBe(false);
    });

    it('form validation should fail - end date should be greater than start date', () => {
      const dateError = component.cpI18n.translate('events_error_end_date_before_start');

      fillForm(component.form, filledForm);

      const future = CPDate.now(session.tz)
        .add(1, 'day')
        .unix();
      const now = CPDate.now(session.tz).unix();
      component.form.get('end').setValue(now);
      component.form.get('start').setValue(future);

      component.onSubmit();

      expect(component.formError).toBe(true);
      expect(component.buttonData.disabled).toBe(false);
      expect(component.handleError).toHaveBeenCalledWith(dateError);
    });

    it('form validation should fail - event end date should be in future', () => {
      const dateError = component.cpI18n.translate('events_error_end_date_after_now');

      fillForm(component.form, filledForm);

      component.form.get('start').setValue(1460806527);
      component.form.get('end').setValue(1492342527);

      component.onSubmit();

      expect(component.formError).toBe(true);
      expect(component.buttonData.disabled).toBe(false);
      expect(component.handleError).toHaveBeenCalledWith(dateError);
    });
  });

  describe('CREATE EVENT', () => {
    it('should create an orientation event', () => {
      component.orientationId = 123;
      const params = new HttpParams()
        .set('school_id', session.g.get('school').id)
        .set('calendar_id', component.orientationId.toString());

      const future = CPDate.now(session.tz)
        .add(1, 'day')
        .unix();
      const now = CPDate.now(session.tz).unix();

      fillForm(component.form, filledForm);

      component.form.get('start').setValue(now);
      component.form.get('end').setValue(future);

      component.onSubmit();

      expect(spy).toHaveBeenCalled();
      expect(component.form.valid).toBe(true);
      expect(component.formError).toBe(false);
      expect(spy).toHaveBeenCalledWith(component.form.value, params);
    });

    it('should create an event', () => {
      const params = new HttpParams();
      const future = CPDate.now(session.tz)
        .add(1, 'day')
        .unix();
      const now = CPDate.now(session.tz).unix();

      fillForm(component.form, filledForm);

      component.form.get('start').setValue(now);
      component.form.get('end').setValue(future);

      component.onSubmit();

      expect(spy).toHaveBeenCalled();
      expect(component.form.valid).toBe(true);
      expect(component.formError).toBe(false);
      expect(spy).toHaveBeenCalledWith(component.form.value, params);
    });
  });
});
