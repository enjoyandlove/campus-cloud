import { Injectable } from '@angular/core';

import { amplitudeEvents } from '../../../shared/constants/analytics';

@Injectable()
export class AssessUtilsService {

  getEventProperties(filterState) {
    return {
      interval: filterState.range.label,
      cohort_type: this.getCohortType(filterState.for),
      engagement_source: this.getEngagementType(filterState.engagement),
    };
  }

  getEngagementType(engagement) {
    return engagement.data.queryParam === 'service_id'
      ? amplitudeEvents.ONE_SERVICE
      : engagement.label;
  }

  getCohortType(cohort) {
    return cohort.listId ? amplitudeEvents.LIST : cohort.label;
  }
}
