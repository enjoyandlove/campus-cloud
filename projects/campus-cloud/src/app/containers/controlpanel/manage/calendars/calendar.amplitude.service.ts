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
      event_id: item.id,
      sub_menu_name: 'Calendars',
      host_type: amplitudeEvents.INSTITUTION,
      feedback: amplitudeEvents.NOT_APPLICABLE,
      qr_code_status: amplitudeEvents.NOT_APPLICABLE,
      location: this.getPropertyStatus(item.location),
      assessment_status: amplitudeEvents.NOT_APPLICABLE,
      description: this.getPropertyStatus(item.description)
    };
  }

  static getItemProperties() {
    return {
      item_type: 'Calendar',
      wall_status: amplitudeEvents.NOT_APPLICABLE,
      location_status: amplitudeEvents.NOT_APPLICABLE
    };
  }
}
