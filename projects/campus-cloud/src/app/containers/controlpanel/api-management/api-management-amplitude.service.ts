import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable()
export class ApiManagementAmplitudeService {
  static getApiType(type) {
    if ('user' in type && 'notification' in type) {
      return amplitudeEvents.BOTH;
    } else if ('user' in type) {
      return amplitudeEvents.USER_INFORMATION;
    } else {
      return amplitudeEvents.PUSH_NOTIFICATION;
    }
  }

  static getEventProperties(data) {
    return {
      api_key_id: data.id,
      api_type: ApiManagementAmplitudeService.getApiType(data.permission_data)
    };
  }
}
