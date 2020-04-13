import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { ApiType } from '@controlpanel/campus-app-management/api-management/model';

@Injectable()
export class ApiManagementAmplitudeService {
  static getApiType(type) {
    if (ApiType.user in type && ApiType.notification in type) {
      return amplitudeEvents.BOTH;
    } else if (ApiType.user in type) {
      return amplitudeEvents.USER_INFORMATION;
    } else if (ApiType.notification in type) {
      return amplitudeEvents.PUSH_NOTIFICATION;
    } else {
      return amplitudeEvents.NOT_SELECTED;
    }
  }

  static getAudienceType(type) {
    if (ApiType.audience in type && ApiType.experience in type) {
      return amplitudeEvents.ALL;
    } else if (ApiType.audience in type) {
      return amplitudeEvents.AUDIENCE;
    } else if (ApiType.experience in type) {
      return amplitudeEvents.EXPERIENCE;
    } else if (ApiType.campus in type) {
      return amplitudeEvents.CAMPUS;
    } else {
      return amplitudeEvents.NOT_SELECTED;
    }
  }

  static getEventProperties(data) {
    return {
      api_key_id: data.id,
      api_type: this.getApiType(data.permission_data),
      audience_type: this.getAudienceType(data.permission_data)
    };
  }
}
