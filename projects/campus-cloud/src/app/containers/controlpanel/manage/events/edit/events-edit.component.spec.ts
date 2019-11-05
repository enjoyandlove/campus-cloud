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
import { AdminService } from '@campus-cloud/shared/services';
import { EventsEditComponent } from './events-edit.component';
import { mockEvent } from '@controlpanel/manage/events/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { EventsModel } from '@controlpanel/manage/events/model/events.model';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('EventEditComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, EventsModule, HttpClientModule, RouterTestingModule],
        providers: [AdminService, provideMockStore()],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let session;
  let component: EventsEditComponent;
  let fixture: ComponentFixture<EventsEditComponent>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventsEditComponent);

    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    component.eventId = 1002;
    component.isFormReady = true;

    spyOn(component, 'buildHeader');
    spyOn(component, 'handleError');
    spyOn(component.router, 'navigate');
    spyOn(component, 'trackQrCode');
    spyOn(component, 'trackEditEvent');
    component.form = EventsModel.form(false, mockEvent);
    spy = spyOn(component.service, 'updateEvent').and.returnValue(of({}));
    spyOn(component.service, 'getEventById').and.returnValue(of(mockEvent));
  }));

  describe('FORM VALIDATION', () => {
    it('form validation should fail required fields missing', () => {
      const errorMessage = component.cpI18n.translate('error_fill_out_marked_fields');

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

      expect(component.buttonData.disabled).toBe(false);
    });

    it('form validation should fail - end date should be greater than start date', () => {
      const dateError = component.cpI18n.translate('events_error_end_date_before_start');

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

      component.form.get('end').setValue(1492342527);
      component.form.get('start').setValue(1460806527);

      component.onSubmit();

      expect(component.formError).toBe(true);
      expect(component.buttonData.disabled).toBe(false);
      expect(component.handleError).toHaveBeenCalledWith(dateError);
    });
  });

  describe('UPDATE EVENT', () => {
    it('should edit an orientation event', () => {
      component.orientationId = 1001;
      const params = new HttpParams()
        .set('school_id', session.g.get('school').id)
        .set('calendar_id', component.orientationId.toString());

      const future = CPDate.now(session.tz)
        .add(1, 'day')
        .unix();
      const now = CPDate.now(session.tz).unix();

      component.form.get('start').setValue(now);
      component.form.get('end').setValue(future);

      component.onSubmit();

      expect(spy).toHaveBeenCalled();
      expect(component.form.valid).toBe(true);
      expect(component.trackQrCode).toHaveBeenCalled();
      expect(component.trackEditEvent).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(component.form.value, component.eventId, params);
    });

    it('should edit an event', () => {
      const params = new HttpParams();

      const future = CPDate.now(session.tz)
        .add(1, 'day')
        .unix();
      const now = CPDate.now(session.tz).unix();

      component.form.get('start').setValue(now);
      component.form.get('end').setValue(future);

      component.onSubmit();

      expect(spy).toHaveBeenCalled();
      expect(component.form.valid).toBe(true);
      expect(component.trackQrCode).toHaveBeenCalled();
      expect(component.trackEditEvent).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(component.form.value, component.eventId, params);
    });
  });
});
