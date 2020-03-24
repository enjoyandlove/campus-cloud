import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class DealsAmplitudeService {
  static getItemProperties() {
    return {
      item_type: 'Deals',
      wall_status: amplitudeEvents.NOT_APPLICABLE,
      location_status: amplitudeEvents.NOT_APPLICABLE
    };
  }
}
