import IEvent from './event.interface';

import { Injectable } from '@angular/core';
import { CPSession } from '../../../../session';
import { EventAttendance } from './event.status';
import { CPDate } from './../../../../shared/utils/date/date';

@Injectable()
export class EventUtilService {
  constructor(public session: CPSession) {}
  isPastEvent(event: IEvent): boolean {
    return event.end < CPDate.toEpoch(CPDate.now(), this.session.tz);
  }

  isUpcomingEvent(event: IEvent) {
    return event.start > CPDate.toEpoch(CPDate.now(), this.session.tz);
  }

  buildUrlPrefix(clubId: number = null, serviceId: number = null, athleticId: number = null) {
    if (athleticId) {
      return `/manage/athletics/${clubId}/events`;
    } else if (clubId) {
      return `/manage/clubs/${clubId}/events`;
    } else if (serviceId) {
      return `/manage/services/${serviceId}/events`;
    }

    return '/manage/events';
  }

  getSubNavChildren(event, urlPrefix) {
    const pastEvent = this.isPastEvent(event);
    const attendanceEnabled = event.event_attendance === EventAttendance.enabled;

    const children = [
      {
        label: 'info',
        url: `${urlPrefix}/${event.id}/info`
      },
      {
        label: 'assessment',
        url: `${urlPrefix}/${event.id}`
      }
    ];

    return pastEvent && attendanceEnabled ? children : [];
  }
}
