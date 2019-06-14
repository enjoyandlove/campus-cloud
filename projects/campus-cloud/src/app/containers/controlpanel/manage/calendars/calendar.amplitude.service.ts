import { AbstractControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

import { IItem } from './items/item.interface';
import { ICalendar } from './calendars.interface';
import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable()
export class CalendarAmplitudeService {
  static getPropertyStatus(value) {
    return value ? amplitudeEvents.YES : amplitudeEvents.NO;
  }

  static getCalendarEventProperties(calendar: ICalendar) {
    return {
      calendar_id: calendar.id,
      description: calendar.description ? amplitudeEvents.YES : amplitudeEvents.NO
    };
  }

  static getDescriptionStatus(control: AbstractControl) {
    return !control.value
      ? amplitudeEvents.NO_DESCRIPTION
      : control.dirty
      ? amplitudeEvents.ADDED_DESCRIPTION
      : amplitudeEvents.NO_CHANGES;
  }

  static getCalendarUpdateEventProperties(form: FormGroup) {
    const calendar_id = form.get('id').value;
    const updated_description = this.getDescriptionStatus(form.get('description'));
    const updated_name = form.get('name').dirty ? amplitudeEvents.YES : amplitudeEvents.NO;

    return {
      calendar_id,
      updated_name,
      updated_description
    };
  }

  static getCalendarEventItemProperties(item: IItem) {
    return {
      calendar_event_id: item.id,
      location: this.getPropertyStatus(item.location),
      all_day: this.getPropertyStatus(item.is_all_day),
      description: this.getPropertyStatus(item.description)
    };
  }
}
