import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class OrientationAmplitudeService {
  static getItemProperties(data) {
    const wall_status = data.has_membership ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
    return {
      wall_status,
      item_type: 'Orientation',
      location_status: amplitudeEvents.NOT_APPLICABLE
    };
  }
}
