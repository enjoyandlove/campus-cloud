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
      added_image: amplitudeEvents.NOT_APPLICABLE,
      wall_status: amplitudeEvents.NOT_APPLICABLE
    };
  }
}
