import IEvent from './event.interface';
import { Injectable } from '@angular/core';

import { CPSession } from '../../../../session';
import { CPI18nService } from '../../../../shared/services';
import { CPDate } from './../../../../shared/utils/date/date';
import { CP_PRIVILEGES_MAP } from '../../../../shared/constants';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { createSpreadSheet } from '../../../../shared/utils/csv/parser';

import {
  qrCode,
  Location,
  Feedback,
  Assessment,
  UploadedPhoto,
  EventFeedback,
  attendanceType,
  CheckInOutTime,
  EventAttendance
} from './event.status';

@Injectable()
export class EventUtilService {
  timeFormat = 'h:mm a';
  dateFormat = 'MMMM Do YYYY';
  timeDurationFormat = 'DDD:h:mm:s';

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

  getAttendanceTypeOptions() {
    return [
      {
        label: this.cpI18n.translate('t_events_assessment_check_in_only'),
        action: attendanceType.checkInOnly
      },
      {
        label: this.cpI18n.translate('t_events_assessment_check_in_and_checkout'),
        action: attendanceType.checkInCheckOut
      },
    ];
  }

  getQROptions() {
    return [
      {
        label: this.cpI18n.translate('t_events_assessment_qr_enabled_yes'),
        action: qrCode.enabled
      },
      {
        label: this.cpI18n.translate('t_events_assessment_qr_enabled_no'),
        action: qrCode.disabled
      },
    ];
  }

  getAttendanceFeedback() {
    return [
      {
        label: this.cpI18n.translate('event_enabled'),
        action: EventAttendance.enabled
      },
      {
        label: this.cpI18n.translate('events_disabled'),
        action: EventAttendance.disabled
      }
    ];
  }

  getToolTipContent(label) {
    return {
      content: this.cpI18n.translate(label)
    };
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

  createExcel(stream, hasCheckOut) {
    stream.toPromise().then((attendees: Array<any>) => {
      const columns = [
        this.cpI18n.translate('events_attendant'),
        this.cpI18n.translate('events_attendee_email'),
        this.cpI18n.translate('t_events_csv_column_check_in_date'),
        this.cpI18n.translate('t_events_csv_column_time_in'),
        this.cpI18n.translate('t_events_csv_column_check_out_date'),
        this.cpI18n.translate('t_events_csv_column_time_out'),
        this.cpI18n.translate('t_events_csv_column_time_spent'),
        this.cpI18n.translate('t_events_csv_column_time_spent_seconds'),
        this.cpI18n.translate('rating'),
        this.cpI18n.translate('events_user_feedback'),
        this.cpI18n.translate('events_checked_in_method'),
        this.cpI18n.translate('student_id')
      ];

      const check_in_method = {
        1: 'Web',
        3: 'QR Code'
      };

      attendees = attendees.map((item) => {
        const timeSpentSeconds = (item.check_out_time_epoch - item.check_in_time);

        const hasCheckOutTimeSpent = hasCheckOut
          && item.check_out_time_epoch
          && item.check_out_time_epoch !== CheckInOutTime.empty;

        return {
          [this.cpI18n.translate('events_attendant')]: `${item.firstname} ${item.lastname}`,

          [this.cpI18n.translate('events_attendee_email')]: item.email,

          [this.cpI18n.translate('t_events_csv_column_check_in_date')]:
            CPDate.fromEpoch(item.check_in_time, this.session.tz).format(this.dateFormat),

          [this.cpI18n.translate('t_events_csv_column_time_in')]: CPDate.fromEpoch(
            item.check_in_time, this.session.tz).format(this.timeFormat),

          [this.cpI18n.translate('t_events_csv_column_check_out_date')]:
            hasCheckOutTimeSpent ? CPDate.fromEpoch(
              item.check_out_time_epoch, this.session.tz).format(this.dateFormat) : '',

          [this.cpI18n.translate('t_events_csv_column_time_out')]:
            hasCheckOutTimeSpent ? CPDate.fromEpoch(
            item.check_out_time_epoch, this.session.tz).format(this.timeFormat) : '',

          [this.cpI18n.translate('t_events_csv_column_time_spent')]:
            hasCheckOutTimeSpent ? CPDate.fromEpoch(
              timeSpentSeconds, this.session.tz).format(this.timeDurationFormat) : '',

          [this.cpI18n.translate('t_events_csv_column_time_spent_seconds')]:
            hasCheckOutTimeSpent ? timeSpentSeconds : '',

          [this.cpI18n.translate('rating')]:
            item.feedback_rating === -1 ? '' : (item.feedback_rating * 5 / 100).toFixed(2),

          [this.cpI18n.translate('events_user_feedback')]: item.feedback_text,

          [this.cpI18n.translate('events_checked_in_method')]: check_in_method[
            item.check_in_method
            ],

          [this.cpI18n.translate('student_id')]: item.student_identifier
        };
      });

      createSpreadSheet(attendees, columns);
    });
  }
}
