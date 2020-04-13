import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class JobsAmplitudeService {
  static getItemProperties(data) {
    const location_status = data.location ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;

    return {
      location_status,
      item_type: 'Jobs',
      wall_status: amplitudeEvents.NOT_APPLICABLE
    };
  }
}
