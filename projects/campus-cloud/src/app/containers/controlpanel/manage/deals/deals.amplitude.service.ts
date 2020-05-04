import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class DealsAmplitudeService {
  static getItemProperties(addedImage) {
    return {
      item_type: 'Deals',
      added_image: addedImage ? 'Yes' : 'No',
      wall_status: amplitudeEvents.NOT_APPLICABLE,
      location_status: amplitudeEvents.NOT_APPLICABLE
    };
  }
}
