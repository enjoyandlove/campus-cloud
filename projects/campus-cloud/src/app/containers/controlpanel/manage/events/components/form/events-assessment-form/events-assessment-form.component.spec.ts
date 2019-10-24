import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { AdminService } from '@campus-cloud/shared/services';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { mockAttendees } from '@controlpanel/manage/events/tests';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { EventsModel } from '@controlpanel/manage/events/model/events.model';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { EventsAssessmentFormComponent } from './events-assessment-form.component';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { CheckInMethod, EventAttendance, EventFeedback } from '../../../event.status';

describe('EventsAssessmentFormComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [EventsAssessmentFormComponent],
        providers: [AdminService, EventUtilService],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let session;
  let fixture: ComponentFixture<EventsAssessmentFormComponent>;
  let component: EventsAssessmentFormComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventsAssessmentFormComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);
    component.form = EventsModel.form(false);
  }));

  it('should toggle QR code value onSelectedQRCode', () => {
    let result;
    component.form
      .get('attend_verification_methods')
      .setValue([CheckInMethod.web, CheckInMethod.webQr, CheckInMethod.app]);

    component.onSelectedQRCode(false);

    result = component.form.get('attend_verification_methods').value;

    expect(result).toEqual([CheckInMethod.web, CheckInMethod.webQr]);

    component.onSelectedQRCode(true);

    result = component.form.get('attend_verification_methods').value;

    expect(result).toEqual([CheckInMethod.web, CheckInMethod.webQr, CheckInMethod.app]);
  });

  it('should reset event attendance & QR code value on toggleEventAttendance', () => {
    const feedbackQuestion = component.cpI18n.translate('t_events_default_feedback_question');
    component.attendanceFeedbackLabel = feedbackQuestion;

    component.toggleEventAttendance(true);

    const feedback = component.form.get('event_feedback').value;
    const eventAttendance = component.form.get('event_attendance').value;
    const feedbackLabel = component.form.get('custom_basic_feedback_label').value;
    const attend_methods = component.form.get('attend_verification_methods').value;

    expect(feedbackLabel).toBe(feedbackQuestion);
    expect(feedback).toBe(EventFeedback.enabled);
    expect(eventAttendance).toBe(EventAttendance.enabled);
    expect(attend_methods).toEqual([CheckInMethod.web, CheckInMethod.webQr, CheckInMethod.app]);
  });

  it('should set feedback status & question onEventFeedbackChange', () => {
    const feedbackQuestion = component.cpI18n.translate('t_events_default_feedback_question');

    const option = {
      action: true
    };

    component.onEventFeedbackChange(option);

    const feedback = component.form.get('event_feedback').value;
    const feedbackLabel = component.form.get('custom_basic_feedback_label').value;

    expect(feedback).toBe(true);
    expect(feedbackLabel).toBe(feedbackQuestion);
  });

  it('should fetch managers by store id if not orientation event', () => {
    const storeId = 12;
    const params: HttpParams = new HttpParams()
      .append('school_id', session.g.get('school').id.toString())
      .append('privilege_type', CP_PRIVILEGES_MAP.events.toString())
      .append('store_id', storeId.toString());

    const spy = spyOn(component.adminService, 'getAdminByStoreId').and.returnValue(
      of(mockAttendees)
    );

    component.fetchManagersBySelectedStore(storeId.toString());

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(params);
  });

  it('should fetch managers without store id for orientation event', () => {
    const storeId = 12;
    component.isOrientation = true;
    const params: HttpParams = new HttpParams()
      .append('school_id', session.g.get('school').id.toString())
      .append('privilege_type', CP_PRIVILEGES_MAP.orientation.toString());

    const spy = spyOn(component.adminService, 'getAdminByStoreId').and.returnValue(
      of(mockAttendees)
    );

    component.fetchManagersBySelectedStore(storeId);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(params);
  });
});
