import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class LocationsAmplitudeService {
  static getItemProperties(data, item_type = 'Location') {
    const location_status = data.address ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
    return {
      item_type,
      location_status,
      wall_status: amplitudeEvents.NOT_APPLICABLE
    };
  }
}
