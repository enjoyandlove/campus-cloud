import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import moment = require('moment');

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

  getAllDay(val) {
    return val ? AllDay.yes : AllDay.no;
  }

  getLocation(location) {
    return location ? Location.yes : Location.no;
  }

  getStartMonth(date) {
    return moment(date).format('MMMM');
  }

  getEndMonth(date) {
    return moment(date).format('MMMM');
  }

  setEventProperties(data) {
    return {
      end_date: this.getEndMonth(CPDate.fromEpoch(data.end, this.session.tz)),
      start_date: this.getStartMonth(CPDate.fromEpoch(data.start, this.session.tz)),
      all_day: this.getAllDay(data.is_all_day),
      location: this.getLocation(data.location),
      calendar_event_id: data.id
    };
  }
}
