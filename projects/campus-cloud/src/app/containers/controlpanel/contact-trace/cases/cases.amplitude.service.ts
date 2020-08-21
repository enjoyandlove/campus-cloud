import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class CasesAmplitudeService {
  static getItemProperties(data, item_type = 'Case') {
    const case_status = data.address ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
    return {
      item_type,
      case_status,
      wall_status: amplitudeEvents.NOT_APPLICABLE
    };
  }
}
