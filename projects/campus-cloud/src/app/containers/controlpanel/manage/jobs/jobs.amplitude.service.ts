import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';

@Injectable({
  providedIn: 'root'
})
export class JobsAmplitudeService {
  constructor(private cpTracking: CPTrackingService) {}

  static getItemProperties(data) {
    const location_status = data.location ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;

    return {
      location_status,
      item_type: 'Jobs',
      added_image: amplitudeEvents.NOT_APPLICABLE,
      wall_status: amplitudeEvents.NOT_APPLICABLE
    };
  }

  amplitudeEmployerClickedItem() {
    const amplitude = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_type: amplitudeEvents.EMPLOYER
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.CLICKED_CREATE_ITEM, amplitude);
  }
}
