import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { of as observableOf } from 'rxjs';

import { CheckInEditComponent } from './edit.component';
import { EventsModule } from '../../../../events.module';
import { AttendanceType } from '../../../../event.status';
import { EventsService } from '../../../../events.service';
import { CPSession } from '../../../../../../../../session';
import { CheckInUtilsService } from '../check-in.utils.service';
import { mockSchool } from '../../../../../../../../session/mock';
import { EventUtilService } from '../../../../events.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services';

class MockService {
  dummy;

  updateEventCheckIn(body: any, id: number, search: any) {
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
    has_checkout: AttendanceType.checkInCheckOut
  };

  const mockCheckIn = require('../mockCheckIn.json');

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          EventsModule,
          RouterTestingModule
        ],
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
          fixture = TestBed.createComponent(CheckInEditComponent);

          component = fixture.componentInstance;
          component.session.g.set('school', mockSchool);
          component.checkIn = mockCheckIn;
          component.event = mockEvent;
          component.ngOnInit();
        });
    })
  );

  it('buttonData should have "Save" label & "primary class"', () => {
    component.ngOnInit();
    expect(component.buttonData.text).toEqual('Save');
    expect(component.buttonData.class).toEqual('primary');
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

  it('form validation should fail - check-in time should be in future', () => {
    const dateError = component.cpI18n
      .translate('t_events_attendance_add_check_in_error_check_in_time_after_now');

    component.form.controls['check_in_time'].setValue(1460806527);
    component.onSubmit();

    expect(component.formErrors).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(component.errorMessage).toEqual(dateError);
  });

  it('form validation should fail- check-out time should be greater than check-in time', () => {
    const dateError = component.cpI18n
      .translate('t_events_attendance_add_check_in_error_check_out_time_after_check_in');

    component.form.controls['check_in_time'].setValue(1598918399);
    component.form.controls['check_out_time_epoch'].setValue(1538390648);
    component.onSubmit();

    expect(component.formErrors).toBeTruthy();
    expect(component.buttonData.disabled).toBeFalsy();
    expect(component.errorMessage).toEqual(dateError);
  });

  it('should edit event check-in', () => {
    spyOn(component.edited, 'emit');
    spyOn(component, 'resetModal');
    spy = spyOn(component.service, 'updateEventCheckIn')
      .and.returnValue(observableOf(mockCheckIn));

    component.form.controls['check_in_time'].setValue(1598918399);
    component.form.controls['check_out_time_epoch'].setValue(1601549048);
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
