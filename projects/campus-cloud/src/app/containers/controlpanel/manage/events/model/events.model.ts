import { FormBuilder, Validators } from '@angular/forms';
import { get as _get } from 'lodash';

import { CustomValidators } from '@campus-cloud/shared/validators';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';

export class EventsModel {
  static form(isOrientation, event?) {
    const fb = new FormBuilder();

    return fb.group(
      {
        city: [_get(event, 'city', null)],
        latitude: [_get(event, 'latitude', 0)],
        country: [_get(event, 'country', null)],
        address: [_get(event, 'address', null)],
        longitude: [_get(event, 'longitude', 0)],
        location: [_get(event, 'location', null)],
        province: [_get(event, 'province', null)],
        room_data: [_get(event, 'room_data', null)],
        is_all_day: [_get(event, 'is_all_day', null)],
        description: [_get(event, 'description', null)],
        postal_code: [_get(event, 'postal_code', null)],
        has_checkout: [_get(event, 'has_checkout', null)],
        end: [_get(event, 'end', null), Validators.required],
        event_feedback: [_get(event, 'event_feedback', null)],
        start: [_get(event, 'start', null), Validators.required],
        event_attendance: [_get(event, 'event_attendance', null)],
        event_manager_id: [_get(event, 'event_manager_id', null)],
        poster_url: [_get(event, 'poster_url', null), Validators.required],
        attendance_manager_email: [_get(event, 'attendance_manager_email', null)],
        poster_thumb_url: [_get(event, 'poster_thumb_url', null), Validators.required],
        custom_basic_feedback_label: [_get(event, 'custom_basic_feedback_label', null)],
        attend_verification_methods: [_get(event, 'attend_verification_methods', null)],
        store_id: [_get(event, 'store_id', null), !isOrientation ? Validators.required : null],
        title: [
          _get(event, 'title', null),
          Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])
        ]
      },
      { validator: EventUtilService.assessmentEnableCustomValidator }
    );
  }
}
