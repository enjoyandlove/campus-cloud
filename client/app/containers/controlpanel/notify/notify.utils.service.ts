import { FormGroup, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { trim as _trim } from 'lodash';

import { types } from './templates/compose/announcement-types';
import { amplitudeEvents } from '@app/shared/constants/analytics';

@Injectable()
export class NotifyUtilsService {
  setEventProperties(data, sub_menu_name) {
    return {
      sub_menu_name,
      announcement_id: data.id,
      audience_type: this.getAudienceType(data),
      announcement_type: this.getAnnouncementType(data)
    };
  }

  getAudienceType(data) {
    if (data.list_details && data.list_details.length) {
      return amplitudeEvents.DYNAMIC_AUDIENCE;
    } else if (data.user_details && data.user_details.length) {
      return amplitudeEvents.CUSTOM_AUDIENCE;
    }

    return amplitudeEvents.CAMPUS_WIDE;
  }

  getAnnouncementType(data) {
    return types.filter((item) => item.action === data.priority)[0].label;
  }

  trimWhiteSpaces(controls: FormGroup): ValidationErrors | null {
    const title = controls.get('subject').value;
    const message = controls.get('message').value;

    return _trim(title) && _trim(message) ? null : { required: true };
  }
}
