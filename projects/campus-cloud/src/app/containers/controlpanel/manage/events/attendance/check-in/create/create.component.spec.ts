import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockCheckIn } from '../../../tests';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPI18nService } from '@campus-cloud/shared/services';
import { EventsModule } from '../../../events.module';
import { attendanceType } from '../../../event.status';
import { EventsService } from '../../../events.service';
import { CheckInCreateComponent } from './create.component';
import { CheckInUtilsService } from '../check-in.utils.service';
import { EventUtilService } from '../../../events.utils.service';

class MockService {
  dummy;

  addCheckIn(body: any, search: any) {
    this.dummy = [search];

    return observableOf({ body });
  }

  addOrientationCheckIn(body: any, search: any) {
    this.dummy = [search];

    return observableOf({ body });
  }
}

describe('EventCheckInCreateComponent', () => {
  let spy;
  let component: CheckInCreateComponent;
  let fixture: ComponentFixture<CheckInCreateComponent>;

  const mockEvent = {
    id: 12543,
    has_checkout: attendanceType.checkInCheckOut
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EventsModule, RouterTestingModule],
      providers: [
        CPSession,
        FormBuilder,
        CPI18nService,
        EventUtilService,
        CheckInUtilsService,
        { provide: EventsService, useClass: MockService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CheckInCreateComponent);

        component = fixture.componentInstance;
        component.session.g.set('school', mockSchool);
        component.data = {
          ...component.data,
          ...mockEvent
        };

        component.ngOnInit();
        component.form = component.checkInUtils.getCheckInForm(mockCheckIn, component.data);
      });
  }));

  it('should add event check-in', () => {
    spyOn(component.created, 'emit');
    spyOn(component, 'resetModal');

    const checkin = {
      ...mockCheckIn,
      attendance_id: 4525
    };

    spy = spyOn(component.service, 'addCheckIn').and.returnValue(observableOf(checkin));

    const checkInTime = 1598918399;
    const checkOutTimeInFuture = 1601549048;

    component.form.controls['check_in_time'].setValue(checkInTime);
    component.form.controls['check_out_time_epoch'].setValue(checkOutTimeInFuture);
    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.formErrors).toBeFalsy();
    expect(component.form.valid).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.resetModal).toHaveBeenCalled();
    expect(component.created.emit).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });

  it('form validation should fail required fields missing', () => {
    component.form.controls['email'].setValue(null);
    component.form.controls['firstname'].setValue(null);
    component.form.controls['lastname'].setValue(null);
    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    expect(component.formErrors).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
  });

  it('error - user already exist', () => {
    spyOn(component.created, 'emit');
    spyOn(component, 'resetModal');

    delete mockCheckIn['attendance_id'];

    spy = spyOn(component.service, 'addCheckIn').and.returnValue(observableOf(mockCheckIn));

    const checkInTime = 1598918399;
    const checkOutTimeInFuture = 1601549048;
    const errorMessage = component.cpI18n.translate('t_event_check_in_attendee_already_exist');

    component.form.controls['check_in_time'].setValue(checkInTime);
    component.form.controls['check_out_time_epoch'].setValue(checkOutTimeInFuture);

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.formErrors).toBe(true);
    expect(component.errorMessage).toEqual(errorMessage);
  });

  it('form validation should fail- check-out time should be greater than check-in time', () => {
    const dateError = component.cpI18n.translate(
      't_events_attendance_add_check_in_error_check_out_time_after_check_in'
    );

    const checkInTime = 1598918399;
    const checkOutTimeInPast = 1538390648;

    component.form.controls['check_in_time'].setValue(checkInTime);
    component.form.controls['check_out_time_epoch'].setValue(checkOutTimeInPast);
    component.onSubmit();

    expect(component.formErrors).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(component.errorMessage).toEqual(dateError);
  });
});
