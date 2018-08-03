import IEvent from './event.interface';

import { Injectable } from '@angular/core';
import { CPSession } from '../../../../session';
import { CPI18nService } from '../../../../shared/services';
import { CPDate } from './../../../../shared/utils/date/date';
import { CP_PRIVILEGES_MAP } from '../../../../shared/constants';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import {
  Location,
  Feedback,
  Assessment,
  UploadedPhoto,
  EventFeedback,
  EventAttendance
} from './event.status';

@Injectable()
export class EventUtilService {
  constructor(public session: CPSession, public cpI18n: CPI18nService) {}
  isPastEvent(event: IEvent): boolean {
    return event.end < CPDate.now(this.session.tz).unix();
  }

  isUpcomingEvent(event: IEvent) {
    return event.start > CPDate.now(this.session.tz).unix();
  }

  buildUrlPrefix(
    clubId: number = null,
    serviceId: number = null,
    athleticId: number = null,
    orientationId: number = null
  ) {
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
    eventId: number = null
  ) {
    if (athleticId) {
      return `/manage/athletics/${clubId}/events/${eventId}/info`;
    } else if (clubId) {
      return `/manage/clubs/${clubId}/events/${eventId}/info`;
    } else if (serviceId) {
      return `/manage/services/${serviceId}/events/${eventId}/info`;
    } else if (orientationId) {
      return `/manage/orientation/${orientationId}/events/${eventId}/info`;
    }

    return `/manage/events/${eventId}/info`;
  }

  buildUrlPrefixExcel(
    orientationId: number = null,
    athleticId: number = null,
    serviceId: number = null,
    clubId: number = null
  ) {
    if (orientationId) {
      return `/manage/orientation/${orientationId}/events/import/excel`;
    } else if (athleticId) {
      return `/manage/athletics/${clubId}/events/import/excel`;
    } else if (serviceId) {
      return `/manage/services/${serviceId}/events/import/excel`;
    } else if (clubId) {
      return `/manage/clubs/${clubId}/events/import/excel`;
    }

    return `/manage/events/import/excel`;
  }

  getSubNavChildren(event, urlPrefix) {
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

    return attendanceEnabled ? children : [];
  }

  getPrivilegeType(type: boolean) {
    return type ? CP_PRIVILEGES_MAP.orientation.toString() : CP_PRIVILEGES_MAP.events.toString();
  }

  getEventCheckInLink(isOrientation = false) {
    if (isOrientation) {
      return '/cb/checkin/o/';
    }

    return '/cb/checkin/e/';
  }

  checkInMethods(checkInMethod) {
    const checkInMethods =  {
      1: this.cpI18n.translate('t_web_checkin_method'),
      2: this.cpI18n.translate('t_web_based_qr_scan'),
      3: this.cpI18n.translate('t_app_checkin_method')
    };

    return checkInMethods[checkInMethod];
  }

  getCheckinSourcePage(
    isAthletic: boolean,
    isService: boolean,
    isClub: boolean,
    isOrientation: boolean
  ) {
    let sourcePage;

    if (isAthletic) {
      sourcePage = amplitudeEvents.ATHLETICS;
    } else if (isService) {
      sourcePage = amplitudeEvents.SERVICE;
    } else if (isClub) {
      sourcePage = amplitudeEvents.CLUB;
    } else if (isOrientation) {
      sourcePage = amplitudeEvents.ORIENTATION;
    } else {
      sourcePage = amplitudeEvents.EVENT;
    }

    return sourcePage;
  }

  hasLocation(location) {
    return location ? Location.yes : Location.no;
  }

  didUploadPhoto(photo) {
    return photo ? UploadedPhoto.yes : UploadedPhoto.no;
  }

  getFeedbackStatus(feedback) {
    return feedback === EventFeedback.enabled ? Feedback.enabled : Feedback.disabled;
  }

  getAssessmentStatus(assessment) {
    return assessment === EventAttendance.enabled ? Assessment.on : Assessment.off;
  }

  setEventProperties(data) {
    const start_date = data['start'].value
      ? CPDate.getMonth(data['start'].value, this.session.tz)
      : null;

    const end_date = data['end'].value ? CPDate.getMonth(data['end'].value, this.session.tz) : null;

    return {
      end_date,
      start_date,
      assessment: this.getAssessmentStatus(data['event_attendance'].value),
      location: this.hasLocation(data['location'].value),
      feedback: this.getFeedbackStatus(data['event_feedback'].value)
    };
  }
}
