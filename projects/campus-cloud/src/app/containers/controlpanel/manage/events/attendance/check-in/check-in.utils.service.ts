import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services';
import { CheckInMethod, CheckInOutTime } from '../../event.status';

@Injectable()
export class CheckInUtilsService {
  form: FormGroup;

  constructor(public fb: FormBuilder, public session: CPSession, public cpI18n: CPI18nService) {}

  checkoutTimeBeforeCheckinTime(checkInTime, checkOutTime, hasCheckOut) {
    const hasCheckOutTime = checkOutTime !== CheckInOutTime.empty && hasCheckOut;
    const isCheckOutLessThanCheckIn = checkOutTime <= checkInTime;

    return hasCheckOutTime ? isCheckOutLessThanCheckIn : hasCheckOutTime;
  }

  getCheckInForm(formData, data) {
    const checkOutValue = formData ? formData.check_out_time_epoch : CheckInOutTime.empty;
    const checkOutTime = data.has_checkout ? checkOutValue : CheckInOutTime.empty;

    this.form = this.fb.group({
      check_out_time_epoch: [checkOutTime],
      event_id: [data.id, Validators.required],
      email: [formData ? formData.email : null, Validators.required],
      anonymous_identifier: [
        formData
          ? formData.anonymous_identifier
            ? formData.anonymous_identifier
            : 'A041411414'
          : null,
        Validators.required
      ],
      lastname: [formData ? formData.lastname : null, Validators.required],
      firstname: [formData ? formData.firstname : null, Validators.required],
      check_in_method: [formData ? formData.check_in_method : CheckInMethod.web],
      check_in_time: [formData ? formData.check_in_time : null, Validators.required]
    });

    if (data.campus_service_id) {
      this.form.removeControl('event_id');

      this.form.addControl(
        'service_id',
        new FormControl(data.campus_service_id, Validators.required)
      );

      this.form.addControl('service_provider_id', new FormControl(data.id, Validators.required));
    }

    return this.form;
  }
}
