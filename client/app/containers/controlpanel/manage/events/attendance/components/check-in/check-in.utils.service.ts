import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { CPSession } from '../../../../../../../session';
import { CPDate } from '../../../../../../../shared/utils/date';
import { CPI18nService } from '../../../../../../../shared/services';
import { CheckInMethod, CheckInOutTime } from '../../../event.status';

@Injectable()
export class CheckInUtilsService {

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService
  ) {}

  isCheckinInPast(form) {
    if (form.controls['check_in_time'].value <= Math.round(CPDate.now(this.session.tz).unix())) {
      form.controls['check_in_time'].setErrors({ required: true });

      return true;
    }

    return false;
  }

  checkoutTimeBeforeCheckinTime(form) {
    if (form.controls['check_out_time_epoch'].value !== CheckInOutTime.empty) {
      if (form.controls['check_out_time_epoch'].value <= form.controls['check_in_time'].value) {
        form.controls['check_out_time_epoch'].setErrors({ required: true });

        return true;
      }

      return false;
    }
  }

  getCheckInForm(formData) {
    return this.fb.group({
      email: [formData ? formData.email : null, Validators.required],
      lastname: [formData ? formData.lastname : null, Validators.required],
      firstname: [formData ? formData.firstname : null, Validators.required],
      check_in_method: [formData ? formData.check_in_method : CheckInMethod.web],
      check_in_time: [formData ? formData.check_in_time : null, Validators.required],
      check_out_time_epoch: [formData ? formData.check_out_time_epoch : CheckInOutTime.empty]
    });
  }
}
