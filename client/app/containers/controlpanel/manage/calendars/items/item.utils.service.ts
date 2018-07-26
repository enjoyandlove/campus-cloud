import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CPSession } from '../../../../../session';
import { CPDate } from './../../../../../shared/utils/date/date';

export enum AllDay {
  'yes' = 'Yes',
  'no' = ' No'
}

export enum Location {
  'yes' = 'Yes',
  'no' = ' No'
}

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

  isAllDay(val) {
    return val ? AllDay.yes : AllDay.no;
  }

  hasLocation(location) {
    return location ? Location.yes : Location.no;
  }

  setEventProperties(data) {
    return {
      calendar_event_id: data.id,
      all_day: this.isAllDay(data.is_all_day),
      location: this.hasLocation(data.location),
      end_date: CPDate.getMonth(data.end, this.session.tz),
      start_date: CPDate.getMonth(data.start, this.session.tz)
    };
  }
}
