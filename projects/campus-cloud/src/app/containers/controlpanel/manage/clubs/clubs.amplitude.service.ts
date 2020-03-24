import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { isClubAthletic } from '@controlpanel/manage/clubs/clubs.athletics.labels';

@Injectable({
  providedIn: 'root'
})
export class ClubsAmplitudeService {
  static getItemProperties(data, type) {
    const item_type = type === isClubAthletic.club ? 'Club' : 'Athletics';
    const location_status = data.address ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
    const wall_status = data.has_membership ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;

    return {
      item_type,
      wall_status,
      location_status
    };
  }
}
