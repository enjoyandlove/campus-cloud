import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';

@Injectable({
  providedIn: 'root'
})
export class DealsAmplitudeService {
  constructor(private cpTracking: CPTrackingService) {}

  static getItemProperties(addedImage) {
    return {
      item_type: 'Deals',
      added_image: addedImage ? 'Yes' : 'No',
      wall_status: amplitudeEvents.NOT_APPLICABLE,
      location_status: amplitudeEvents.NOT_APPLICABLE
    };
  }

  getStoreAmplitudeClickedItem() {
    return {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_type: amplitudeEvents.STORE
    };
  }
}
