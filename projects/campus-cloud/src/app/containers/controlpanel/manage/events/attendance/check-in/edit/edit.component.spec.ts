import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { mockCheckIn } from '../../../tests';
import { EventsModule } from '../../../events.module';
import { attendanceType } from '../../../event.status';
import { EventsService } from '../../../events.service';
import { CheckInEditComponent } from './edit.component';
import { mockSchool } from '@campus-cloud/session/mock';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { CheckInUtilsService } from '../check-in.utils.service';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';

class MockService {
  dummy;

  updateCheckIn(body: any, id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({ body });
  }

  updateOrientationCheckIn(body: any, id: number, search: any) {
    this.dummy = [id, search];

    return observableOf({ body });
  }
}

describe('EventCheckInEditComponent', () => {
  let spy;
  let component: CheckInEditComponent;
  let fixture: ComponentFixture<CheckInEditComponent>;

  const mockEvent = {
    id: 12543,
    has_checkout: attendanceType.checkInCheckOut
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EventsModule, RouterTestingModule, CPTestModule],
      providers: [
        FormBuilder,
        EventUtilService,
        CheckInUtilsService,
        { provide: EventsService, useClass: MockService }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CheckInEditComponent);

        component = fixture.componentInstance;
        component.session.g.set('school', mockSchool);
        component.checkIn = mockCheckIn;
        component.data = {
          ...component.data,
          ...mockEvent
        };
        component.ngOnInit();
      });
  }));

  it('form validation should fail required fields missing', () => {
    component.form.controls['email'].setValue(null);
    component.form.controls['firstname'].setValue(null);
    component.form.controls['lastname'].setValue(null);
    component.onSubmit();

    expect(component.form.valid).toBeFalsy();
    expect(component.formErrors).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
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

  it('should edit event check-in', () => {
    spyOn(component.edited, 'emit');
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'updateCheckIn').and.returnValue(observableOf(mockCheckIn));

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
    expect(component.edited.emit).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
  });
});
