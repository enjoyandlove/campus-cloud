import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

import IEvent from './event.interface';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { CPDate, Formats, createSpreadSheet } from '@campus-cloud/shared/utils';
import { qrCode, EventType, attendanceType, CheckInOutTime, EventAttendance } from './event.status';

export interface IEventType {
  event_id?: number;
  event_type: number;
  event_type_id?: number;
}

@Injectable()
export class EventUtilService {
  constructor(public session: CPSession, public cpI18n: CPI18nService) {}
  isPastEvent(event: IEvent): boolean {
    return event.end < CPDate.now(this.session.tz).unix();
  }

  isUpcomingEvent(event: IEvent) {
    return event.start > CPDate.now(this.session.tz).unix();
  }

  buildUrlPrefix(eventType: IEventType) {
    if (eventType.event_type === EventType.athletics) {
      return `/manage/athletics/${eventType.event_type_id}/events`;
    } else if (eventType.event_type === EventType.club) {
      return `/manage/clubs/${eventType.event_type_id}/events`;
    } else if (eventType.event_type === EventType.services) {
      return `/manage/services/${eventType.event_type_id}/events`;
    } else if (eventType.event_type === EventType.orientation) {
      return `/manage/orientation/${eventType.event_type_id}/events`;
    }

    return '/manage/events';
  }

  buildUrlPrefixEvents(eventType: IEventType) {
    if (eventType.event_type === EventType.athletics) {
      return `/manage/athletics/${eventType.event_type_id}/events/${eventType.event_id}/info`;
    } else if (eventType.event_type === EventType.club) {
      return `/manage/clubs/${eventType.event_type_id}/events/${eventType.event_id}/info`;
    } else if (eventType.event_type === EventType.services) {
      return `/manage/services/${eventType.event_type_id}/events/${eventType.event_id}/info`;
    } else if (eventType.event_type === EventType.orientation) {
      return `/manage/orientation/${eventType.event_type_id}/events/${eventType.event_id}/info`;
    }

    return `/manage/events/${eventType.event_id}/info`;
  }

  buildUrlPrefixExcel(eventType: IEventType) {
    if (eventType.event_type === EventType.orientation) {
      return `/manage/orientation/${eventType.event_type_id}/events/import/excel`;
    } else if (eventType.event_type === EventType.athletics) {
      return `/manage/athletics/${eventType.event_type_id}/events/import/excel`;
    } else if (eventType.event_type === EventType.services) {
      return `/manage/services/${eventType.event_type_id}/events/import/excel`;
    } else if (eventType.event_type === EventType.club) {
      return `/manage/clubs/${eventType.event_type_id}/events/import/excel`;
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

  getAttendanceTypeOptions() {
    return [
      {
        label: this.cpI18n.translate('t_events_assessment_check_in_only'),
        action: attendanceType.checkInOnly
      },
      {
        label: this.cpI18n.translate('t_events_assessment_check_in_and_checkout'),
        action: attendanceType.checkInCheckOut
      }
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
      }
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

  assessmentEnableCustomValidator(controls: FormGroup): ValidationErrors | null {
    const managerId = controls.get('event_manager_id').value;
    const eventFeedback = controls.get('event_feedback').value;
    const eventAttendance = controls.get('event_attendance').value;
    const feedbackLabel = controls.get('custom_basic_feedback_label').value;

    const errors = {};

    if (eventAttendance === EventAttendance.enabled) {
      if (!managerId) {
        errors['eventManagerRequired'] = true;
      }

      if (!feedbackLabel && eventFeedback) {
        errors['feedbackLabelRequired'] = true;
      }

      return errors;
    }

    return null;
  }

  createExcel(stream, showStudentIds = false, event) {
    stream.toPromise().then((attendees: Array<any>) => {
      const columns = [
        this.cpI18n.translate('t_events_csv_column_first_name'),
        this.cpI18n.translate('t_events_csv_column_last_name'),
        this.cpI18n.translate('t_events_csv_column_email'),
        this.cpI18n.translate('events_checked_in_method'),
        this.cpI18n.translate('t_events_csv_column_check_in_date'),
        this.cpI18n.translate('t_events_csv_column_time_in'),
        this.cpI18n.translate('t_events_csv_column_check_out_date'),
        this.cpI18n.translate('t_events_csv_column_time_out'),
        this.cpI18n.translate('t_events_csv_column_time_spent'),
        this.cpI18n.translate('t_events_csv_column_time_spent_seconds'),
        this.cpI18n.translate('ratings'),
        this.cpI18n.translate('t_events_csv_column_feedback_question'),
        this.cpI18n.translate('events_user_feedback')
      ];
      if (showStudentIds) {
        columns.push(this.cpI18n.translate('student_id'));
      }

      const check_in_method = {
        1: 'Web',
        3: 'QR Code'
      };

      attendees = attendees.map((item) => {
        const timeSpentSeconds = item.check_out_time_epoch - item.check_in_time;

        const hasCheckOutTimeSpent =
          event.has_checkout &&
          item.check_out_time_epoch &&
          item.check_out_time_epoch !== CheckInOutTime.empty;

        const row = {
          [this.cpI18n.translate('t_events_csv_column_first_name')]: item.firstname,

          [this.cpI18n.translate('t_events_csv_column_last_name')]: item.lastname,

          [this.cpI18n.translate('t_events_csv_column_email')]: item.email,

          [this.cpI18n.translate('events_checked_in_method')]: check_in_method[
            item.check_in_method
          ],

          [this.cpI18n.translate('t_events_csv_column_check_in_date')]: CPDate.fromEpoch(
            item.check_in_time,
            this.session.tz
          ).format(Formats.dateFormat),

          [this.cpI18n.translate('t_events_csv_column_time_in')]: CPDate.fromEpoch(
            item.check_in_time,
            this.session.tz
          ).format(Formats.timeFormatLong),

          [this.cpI18n.translate('t_events_csv_column_check_out_date')]: hasCheckOutTimeSpent
            ? CPDate.fromEpoch(item.check_out_time_epoch, this.session.tz).format(
                Formats.dateFormat
              )
            : '',

          [this.cpI18n.translate('t_events_csv_column_time_out')]: hasCheckOutTimeSpent
            ? CPDate.fromEpoch(item.check_out_time_epoch, this.session.tz).format(
                Formats.timeFormatLong
              )
            : '',

          [this.cpI18n.translate('t_events_csv_column_time_spent')]: hasCheckOutTimeSpent
            ? CPDate.getTimeDuration(timeSpentSeconds).format(Formats.timeDurationFormat, {
                trim: false,
                useGrouping: false
              })
            : '',

          [this.cpI18n.translate('t_events_csv_column_time_spent_seconds')]: hasCheckOutTimeSpent
            ? timeSpentSeconds
            : '',

          [this.cpI18n.translate('ratings')]:
            item.feedback_rating === -1 ? '' : ((item.feedback_rating * 5) / 100).toFixed(2),

          [this.cpI18n.translate(
            't_events_csv_column_feedback_question'
          )]: event.custom_basic_feedback_label,

          [this.cpI18n.translate('events_user_feedback')]: item.feedback_text
        };

        if (showStudentIds) {
          row[this.cpI18n.translate('student_id')] = item.student_identifier;
        }

        return row;
      });

      createSpreadSheet(attendees, columns);
    });
  }
}
