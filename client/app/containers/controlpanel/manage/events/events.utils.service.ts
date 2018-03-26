import IEvent from './event.interface';

import { Injectable } from '@angular/core';
import { EventAttendance } from './event.status';
import { CPDate } from './../../../../shared/utils/date/date';
import { CP_PRIVILEGES_MAP } from '../../../../shared/constants';

@Injectable()
export class EventUtilService {
  isPastEvent(event: IEvent): boolean {
    return event.end < CPDate.toEpoch(new Date());
  }

  isUpcomingEvent(event: IEvent) {
    return event.start > CPDate.toEpoch(new Date());
  }

  buildUrlPrefix(
    clubId: number = null,
    serviceId: number = null,
    athleticId: number = null,
    orientationId: number = null) {
    if (athleticId) {
      return `/manage/athletics/${clubId}/events`;
    } else if (clubId) {
      return `/manage/clubs/${clubId}/events`;
    } else if (serviceId) {
      return `/manage/services/${serviceId}/events`;
    } else if (orientationId) {
      return `/manage/orientation/${orientationId}/events`;
    }

    return '/manage/events';
  }

  buildUrlPrefixEvents(
    clubId: number = null,
    serviceId: number = null,
    athleticId: number = null,
    orientationId: number = null,
    eventId: number = null) {
    if (athleticId) {
      return `/manage/athletics/${clubId}/events/${eventId}`;
    } else if (clubId) {
      return `/manage/clubs/${clubId}/events/${eventId}`;
    } else if (serviceId) {
      return `/manage/services/${serviceId}/events/${eventId}`;
    } else if (orientationId) {
      return `/manage/orientation/${orientationId}/events/${eventId}`;
    }

    return `/manage/events/${eventId}`;
  }

  getSubNavChildren(event, urlPrefix) {
    const pastEvent = this.isPastEvent(event);
    const attendanceEnabled =
      event.event_attendance === EventAttendance.enabled;

    const children = [
      {
        label: 'info',
        url: `${urlPrefix}/${event.id}/info`,
      },
      {
        label: 'assessment',
        url: `${urlPrefix}/${event.id}`,
      },
    ];

    return pastEvent && attendanceEnabled ? children : [];
  }

  getPrivilegeType(type: boolean) {
    return type ? CP_PRIVILEGES_MAP.orientation.toString() : CP_PRIVILEGES_MAP.events.toString();
  }
}
