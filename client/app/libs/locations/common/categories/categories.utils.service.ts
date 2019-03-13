import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@shared/constants';
import { CPTrackingService } from '@shared/services';

@Injectable()
export class CategoriesUtilsService {
  constructor(public cpTracking: CPTrackingService) {}

  getCategoriesAmplitudeProperties(isLocation?: boolean) {
    const page_type = isLocation
      ? amplitudeEvents.LOCATION_CATEGORY
      : amplitudeEvents.DINING_CATEGORY;

    return {
      ...this.cpTracking.getEventProperties(),
      page_type
    };
  }
}
