import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { omit } from 'lodash';
import { of } from 'rxjs';

import { filledForm } from '../tests/mocks';
import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { MockCalendarsService } from './../tests/mocks';
import { CalendarsModule } from './../calendars.module';
import { CalendarsService } from './../calendars.services';
import { CalendarsCreateComponent } from './create.component';
import { validateMaxLength } from '@campus-cloud/shared/utils/tests';
import { CPTestModule, configureTestSuite } from '@campus-cloud/shared/tests';

describe('CalendarsCreateComponent', () => {
  configureTestSuite();
  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, CalendarsModule],
        providers: [FormBuilder, { provide: CalendarsService, useClass: MockCalendarsService }]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session: CPSession;
  let fixture: ComponentFixture<CalendarsCreateComponent>;
  let component: CalendarsCreateComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CalendarsCreateComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    fixture.detectChanges();
  }));

  describe('form', () => {
    it('should initialized an empty FormGroup', () => {
      expect(component.form instanceof FormGroup).toBe(true);

      const { name, description } = component.form.value;

      expect(name).toBeDefined();
      expect(description).toBeDefined();
    });

    describe('name control', () => {
      let nameControl: AbstractControl;
      beforeEach(() => {
        nameControl = component.form.get('name');
      });

      it('name control is required', () => {
        nameControl.setValue(null);
        expect(nameControl.valid).toBe(false);
      });

      it('name control has a character limit', () => {
        validateMaxLength(nameControl, 225);
      });
    });

    describe('description control', () => {
      it('description control has a character limit', () => {
        const descriptionControl: AbstractControl = component.form.get('description');
        validateMaxLength(descriptionControl, 512);
      });
    });
  });

  describe('resetModal', () => {
    it('should reset form', () => {
      spyOn(component.form, 'reset');
      component.resetModal();
      expect(component.form.reset).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    let createdSpy: jasmine.Spy;
    let resetModalSpy: jasmine.Spy;
    let trackEventSpy: jasmine.Spy;
    let createCalendarspy: jasmine.Spy;
    const payload = omit(filledForm, 'has_membership');
    beforeEach(() => {
      createdSpy = spyOn(component.created, 'emit');
      resetModalSpy = spyOn(component, 'resetModal');
      trackEventSpy = spyOn(component, 'trackEvent');
      createCalendarspy = spyOn(component.service, 'createCalendar').and.returnValue(
        of(filledForm)
      );
      createCalendarspy.calls.reset();

      component.form.setValue(payload);
      component.onSubmit();
    });

    it('should call createCalendar', () => {
      expect(component.service.createCalendar).toHaveBeenCalled();
    });

    it('should call service with right params', () => {
      const [body, args] = <[{}, HttpParams]>createCalendarspy.calls.mostRecent().args;

      expect(args.get('school_id').toString()).toBe(mockSchool.id.toString());
      expect(body).toEqual(payload);
    });

    it('should track event on success', () => {
      expect(component.trackEvent).toHaveBeenCalledWith(filledForm);
    });

    it('should emit created event', () => {
      expect(component.created.emit).toHaveBeenCalledWith(filledForm);
    });

    it('should reset modal', () => {
      expect(resetModalSpy).toHaveBeenCalled();
    });
  });
});
