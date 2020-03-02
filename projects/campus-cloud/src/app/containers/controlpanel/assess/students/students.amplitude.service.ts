import { Injectable } from '@angular/core';

import { CPTrackingService } from '@campus-cloud/shared/services';

@Injectable({
  providedIn: 'root'
})
export class StudentsAmplitudeService {
  constructor(private cpTracking: CPTrackingService) {}

  muteUserAmplitudeProperties(user_id, restriction) {
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties() as any;

    return {
      user_id,
      sub_menu_name,
      status: restriction ? 'Muted' : 'Unmuted'
    };
  }
}
