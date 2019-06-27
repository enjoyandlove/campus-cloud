import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { of as observableOf } from 'rxjs';

import { CheckinService } from '../../checkin.service';
import { CallbackModule } from '../../../callback.module';
import { CPI18nService } from '../../../../../shared/services';
import { CheckOutModalComponent } from './check-out-modal.component';

class MockService {
  dummy;

  doEventCheckin(body: any, search: any) {
    this.dummy = [body, search];

    return [];
  }
}

const mockAttendee = {
  attendance_id: 14725,
  firstname: 'Hello',
  lastname: 'World',
  check_in_type: 'web',
  check_out_time_epoch: -1,
  check_in_time_epoch: 1534759041,
  email: 'hello@oohlalamobile.com'
};

describe('CheckOutModalComponent', () => {
  let spy;
  let component: CheckOutModalComponent;
  let fixture: ComponentFixture<CheckOutModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CallbackModule, HttpClientModule, RouterTestingModule],
      providers: [CPI18nService, { provide: CheckinService, useClass: MockService }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CheckOutModalComponent);
        component = fixture.componentInstance;
        component.attendee = mockAttendee;
        component.eventId = 4585;
        component.ngOnInit();
      });
  }));

  it('form validation should fail required fields missing', () => {
    component.form.controls['email'].setValue(null);
    component.form.controls['lastname'].setValue(null);
    component.form.controls['firstname'].setValue(null);
    component.form.controls['attendance_id'].setValue(null);
    component.form.controls['check_in_time_epoch'].setValue(null);
    component.form.controls['check_out_time_epoch'].setValue(null);
    component.onSubmit();

    expect(component.formErrors).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.buttonData.disabled).toBe(false);
  });

  it('form validation should fail- check-out time should be greater than check-in time', () => {
    const dateError = component.cpI18n.translate('t_external_check_in_greater_than_checkout_error');

    const checkOutTimeInPast = 1504116976;

    component.form.controls['check_out_time_epoch'].setValue(checkOutTimeInPast);
    component.onSubmit();

    expect(component.formErrors).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.buttonData.disabled).toBe(false);
    expect(component.errorMessage).toEqual(dateError);
  });

  it('onSubmit add event check-in', () => {
    spyOn(component, 'resetModal');
    spyOn(component.checkout, 'emit');
    spy = spyOn(component.service, 'doEventCheckin').and.returnValue(observableOf(mockAttendee));

    const checkOutTimeInFuture = 1567188976;

    component.form.controls['check_out_time_epoch'].setValue(checkOutTimeInFuture);
    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.resetModal).toHaveBeenCalled();
    expect(component.form.valid).toBe(true);
    expect(component.formErrors).toBe(false);
    expect(component.checkout.emit).toHaveBeenCalled();
    expect(component.resetModal).toHaveBeenCalledTimes(1);
    expect(component.checkout.emit).toHaveBeenCalledWith(component.attendee);
  });
});
