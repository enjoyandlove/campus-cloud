import { Injectable } from '@angular/core';

import { types } from './templates/compose/announcement-types';
import { amplitudeEvents } from '../../../shared/constants/analytics';

@Injectable()
export class NotifyUtilsService {
  eventProperties;

  setEventProperties(data, listing_type) {
    return {
      ...this.eventProperties,
      listing_type,
      announcement_id: data.id,
      audience_type: this.getAudienceType(data),
      announcement_type: this.getAnnouncementType(data)
    };
  }

  getAudienceType(data) {
    if (data.list_details && data.list_details.length) {
      return amplitudeEvents.LIST;
    } else if (data.user_details && data.user_details.length) {
      return amplitudeEvents.USER;
    }

    return amplitudeEvents.CAMPUS_WIDE;
  }

  getAnnouncementType(data) {
    return types.filter((item) => item.action === data.priority)[0].label;
  }
}
