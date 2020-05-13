import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class ServicesAmplitudeService {
  static getItemProperties(data, addedImage) {
    const added_image = addedImage ? 'Yes' : 'No';
    const location_status = data.address ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
    const wall_status = data.has_membership ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;

    return {
      wall_status,
      added_image,
      location_status,
      item_type: 'Service'
    };
  }
}
