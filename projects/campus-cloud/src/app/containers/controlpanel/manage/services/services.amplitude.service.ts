import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ServicesAmplitudeService {
  static getItemProperties(data) {
    const location_status = data.address ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
    const wall_status = data.has_membership ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;

    return {
      wall_status,
      location_status,
      item_type: 'Service'
    };
  }
}
