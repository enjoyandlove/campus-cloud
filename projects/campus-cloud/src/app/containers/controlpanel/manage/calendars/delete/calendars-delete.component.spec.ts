import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { mockCalendar } from '../tests/mocks';
import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock';
import { CalendarsService } from './../calendars.services';
import { CalendarsDeleteComponent } from './calendars-delete.component';
import { CPDeleteModalComponent } from '@campus-cloud/shared/components';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('CalendarsDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [CalendarsDeleteComponent],
        providers: [CalendarsService],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let de: DebugElement;
  let session: CPSession;
  let cpDeleteModal: CPDeleteModalComponent;
  let fixture: ComponentFixture<CalendarsDeleteComponent>;
  let component: CalendarsDeleteComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CalendarsDeleteComponent);
    component = fixture.componentInstance;

    component.calendar = mockCalendar;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    de = fixture.debugElement;
    cpDeleteModal = de.query(By.directive(CPDeleteModalComponent)).componentInstance;

    fixture.detectChanges();
  }));

  it('should call onClose on cancelClick', () => {
    spyOn(component, 'onClose').and.callThrough();
    spyOn(component.teardown, 'emit');

    cpDeleteModal.cancelClick.emit();

    expect(component.onClose).toHaveBeenCalled();
    expect(component.teardown.emit).toHaveBeenCalled();
  });

  it('should call onDelete on cp-delete-modal deleteClick event', () => {
    spyOn(component, 'onDelete');

    cpDeleteModal.deleteClick.emit();

    expect(component.onDelete).toHaveBeenCalled();
  });

  describe('onDelete', () => {
    let deleteCalendarSpy: jasmine.Spy;

    beforeEach(() => {
      deleteCalendarSpy = spyOn(component.calendarService, 'deleteCalendar').and.returnValue(
        of({})
      );
    });

    it('should emit deleted event', () => {
      spyOn(component.deleted, 'emit');

      component.onDelete();

      expect(component.deleted.emit).toHaveBeenCalled();
    });

    it('should call track event', () => {
      spyOn(component, 'trackEvent');

      component.onDelete();

      expect(component.trackEvent).toHaveBeenCalled();
    });

    it('should send right params', () => {
      component.onDelete();
      const [body, args] = <[{}, HttpParams]>deleteCalendarSpy.calls.mostRecent().args;

      expect(body).toBe(mockCalendar.id);
      expect(args.get('school_id').toString()).toBe(mockSchool.id.toString());
    });

    it('should re-enabled submit button', () => {
      component.onDelete();

      const { disabled } = component.buttonData;
      expect(disabled).toBe(false);
    });
  });
});
