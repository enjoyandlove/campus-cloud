import { Injectable } from '@angular/core';

import { CPI18nService } from '../../../shared/services';
import { amplitudeEvents } from '../../../shared/constants/analytics';

const EventType = {
  event: 'event',
  service: 'service',
  orientation: 'user_event'
};

@Injectable()
export class AssessUtilsService {
  constructor(public cpI18n: CPI18nService) {}

  getEventProperties(filterState) {
    return {
      interval: filterState.range.label,
      cohort_type: this.getCohortType(filterState.for),
      engagement_source: this.getEngagementType(filterState.engagement)
    };
  }

  getEngagementType(engagement) {
    return engagement.data.queryParam === 'service_id'
      ? amplitudeEvents.ONE_SERVICE
      : engagement.label;
  }

  getCohortType(cohort) {
    return cohort['cohort_type'] ? cohort['cohort_type'] : amplitudeEvents.ALL_STUDENTS;
  }

  getEventType(type) {
    if (type === EventType.event) {
      return this.cpI18n.translate('event');
    } else if (type === EventType.service) {
      return this.cpI18n.translate('service');
    } else if (type === EventType.orientation) {
      return this.cpI18n.translate('orientation');
    }
  }
}
