import IEvent from './event.interface';

import { CPDate } from './../../../../shared/utils/date/date';

import { Injectable } from '@angular/core';

@Injectable()
export class EventUtilService {
  isPastEvent(event: IEvent): boolean {
    return event.end < CPDate.toEpoch(new Date());
  }

  isUpcomingEvent(event: IEvent) {
    return event.start > CPDate.toEpoch(new Date());
  };

  buildUrlPrefix(clubId: number = null, serviceId: number = null) {
    if (clubId) {
      return `/manage/clubs/${clubId}/events`;
    } else if (serviceId) {
      return `/manage/services/${serviceId}/events`;
    }
    return '/manage/events';
  }
}
