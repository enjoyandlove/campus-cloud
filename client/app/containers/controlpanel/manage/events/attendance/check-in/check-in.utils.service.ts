import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services';
import { CheckInMethod, CheckInOutTime } from '../../event.status';

@Injectable()
export class CheckInUtilsService {

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService
  ) {}

  checkoutTimeBeforeCheckinTime(checkInTime, checkOutTime, hasCheckOut) {
    const hasCheckOutTime = checkOutTime !== CheckInOutTime.empty && hasCheckOut;
    const isCheckOutLessThanCheckIn = checkOutTime <= checkInTime;

    return hasCheckOutTime ? isCheckOutLessThanCheckIn : hasCheckOutTime;
  }

  getCheckInForm(formData, eventData) {
    const checkOutValue = formData ? formData.check_out_time_epoch : CheckInOutTime.empty;
    const checkOutTime = eventData.has_checkout ? checkOutValue : CheckInOutTime.empty;

    return this.fb.group({
      event_id: [eventData.id, Validators.required],
      email: [formData ? formData.email : null, Validators.required],
      lastname: [formData ? formData.lastname : null, Validators.required],
      firstname: [formData ? formData.firstname : null, Validators.required],
      check_in_method: [formData ? formData.check_in_method : CheckInMethod.web],
      check_in_time: [formData ? formData.check_in_time : null, Validators.required],
      check_out_time_epoch: [checkOutTime]
    });
  }
}
