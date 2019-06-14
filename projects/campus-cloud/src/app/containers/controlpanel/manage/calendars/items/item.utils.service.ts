import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CPSession } from '@app/session';

@Injectable()
export class CalendarsItemsService {
  constructor(public session: CPSession) {}

  validate(form: FormGroup) {
    return form.valid && this.endDateAfterStartDate(form);
  }

  private setRequired(form: FormGroup, controlName: string) {
    form.controls[controlName].setErrors({ required: true });
  }

  private endDateAfterStartDate(form: FormGroup) {
    if (form.controls['is_all_day'].value) {
      return true;
    }

    const valid = form.controls['end'].value > form.controls['start'].value;

    if (!valid) {
      this.setRequired(form, 'end');
    }

    return valid;
  }
}
