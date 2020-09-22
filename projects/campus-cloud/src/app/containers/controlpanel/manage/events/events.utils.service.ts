import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';

import IEvent from './event.interface';
import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import {
  attendanceType,
  AttendeeType,
  CheckInOutTime,
  EventAttendance,
  EventType,
  qrCode,
  SelfCheckInOption
} from './event.status';

import {
  canSchoolWriteResource,
  canStoreReadResource,
  CPDate,
  createSpreadSheet,
  Formats
} from '@campus-cloud/shared/utils';
import { CheckInMethod } from '@controlpanel/manage/events/event.status';
import { IMultiSelectItem } from '@campus-cloud/shared/components';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

export interface IEventType {
  event_id?: number;
  event_type: number;
  event_type_id?: number;
}

@Injectable()
export class EventUtilService {
  constructor(public session: CPSession, public cpI18n: CPI18nPipe) {}

  static assessmentEnableCustomValidator(controls: FormGroup): ValidationErrors | null {
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

  static getFromArray(arr: Array<any>, key: string, val: any) {
    return arr.filter((item) => item[key] === val)[0];
  }

  static getSelfCheckInStatus(selfCheckInMethods, option: number) {
    switch (option) {
      case SelfCheckInOption.qr:
        return selfCheckInMethods.includes(CheckInMethod.app);
      case SelfCheckInOption.email:
        return selfCheckInMethods.includes(CheckInMethod.userWebEntry);
      case SelfCheckInOption.appLink:
        return selfCheckInMethods.includes(CheckInMethod.deepLink);
      default:
        return false;
    }
  }

  static parseEventManagers(admins) {
    return [
      {
        label: '---',
        value: null
      },
      ...admins.map((admin) => {
        return {
          label: `${admin.firstname} ${admin.lastname}`,
          value: admin.id
        };
      })
    ];
  }

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
    const canViewAttendance =
      canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.event_attendance) ||
      canStoreReadResource(this.session.g, event.store_id, CP_PRIVILEGES_MAP.event_attendance);

    const attendanceEnabled =
      event.event_attendance === EventAttendance.enabled && canViewAttendance;

    const children = [
      {
        label: 'info',
        isSubMenuItem: true,
        amplitude: amplitudeEvents.INFO,
        url: `${urlPrefix}/${event.id}/info`
      },
      {
        label: 'assessment',
        isSubMenuItem: true,
        url: `${urlPrefix}/${event.id}`,
        amplitude: amplitudeEvents.ASSESSMENT
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
        label: this.cpI18n.transform('t_events_assessment_check_in_only'),
        action: attendanceType.checkInOnly
      },
      {
        label: this.cpI18n.transform('t_events_assessment_check_in_and_checkout'),
        action: attendanceType.checkInCheckOut
      }
    ];
  }

  getQROptions() {
    return [
      {
        label: this.cpI18n.transform('t_events_assessment_qr_enabled_yes'),
        action: qrCode.enabled
      },
      {
        label: this.cpI18n.transform('t_events_assessment_qr_enabled_no'),
        action: qrCode.disabled
      }
    ];
  }

  getSelfCheckInMethods(): IMultiSelectItem[] {
    return [
      {
        label: this.cpI18n.transform('t_events_assessment_app_link_check_in'),
        action: SelfCheckInOption.appLink,
        selected: false
      },
      {
        label: this.cpI18n.transform('checkin_qr_scan'),
        action: SelfCheckInOption.qr,
        selected: false
      },
      {
        label: this.cpI18n.transform('email'),
        action: SelfCheckInOption.email,
        selected: false
      }
    ];
  }

  getAttendanceFeedback() {
    return [
      {
        label: this.cpI18n.transform('event_enabled'),
        action: EventAttendance.enabled
      },
      {
        label: this.cpI18n.transform('events_disabled'),
        action: EventAttendance.disabled
      }
    ];
  }

  clearDateErrors(form: FormGroup) {
    const end = form.get('end');
    const start = form.get('start');

    if (start.value) {
      start.setErrors(null);
    }

    if (end.value) {
      end.setErrors(null);
    }
  }

  updateTime(form: FormGroup) {
    const end = form.get('end');
    const start = form.get('start');

    const endDateAtMidnight = CPDate.fromEpoch(end.value, this.session.tz).endOf('day');

    const startDateAtMidnight = CPDate.fromEpoch(start.value, this.session.tz).startOf('day');

    end.setValue(CPDate.toEpoch(endDateAtMidnight, this.session.tz));
    start.setValue(CPDate.toEpoch(startDateAtMidnight, this.session.tz));
  }

  setEventFormDateErrors(form: FormGroup) {
    const end = form.get('end').value;
    const start = form.get('start').value;

    if (end <= start) {
      form.get('end').setErrors({ required: true });

      return this.cpI18n.transform('events_error_end_date_before_start');
    }

    if (end <= CPDate.now(this.session.tz).unix()) {
      form.get('end').setErrors({ required: true });

      return this.cpI18n.transform('events_error_end_date_after_now');
    }
  }

  createExcel(stream, showStudentIds = false, event) {
    stream.toPromise().then((attendees: Array<any>) => {
      const columns = [
        this.cpI18n.transform('t_events_csv_column_first_name'),
        this.cpI18n.transform('t_events_csv_column_last_name'),
        this.cpI18n.transform('t_events_csv_column_email'),
        this.cpI18n.transform('events_checked_in_method'),
        this.cpI18n.transform('t_events_csv_column_check_in_date'),
        this.cpI18n.transform('t_events_csv_column_time_in'),
        this.cpI18n.transform('t_events_csv_column_check_out_date'),
        this.cpI18n.transform('t_events_csv_column_time_out'),
        this.cpI18n.transform('t_events_csv_column_time_spent'),
        this.cpI18n.transform('t_events_csv_column_time_spent_seconds'),
        this.cpI18n.transform('ratings'),
        this.cpI18n.transform('t_events_csv_column_feedback_question'),
        this.cpI18n.transform('events_user_feedback')
      ];
      if (showStudentIds) {
        columns.push(this.cpI18n.transform('student_id'));
      }

      const check_in_method = {
        1: 'Web',
        3: 'App',
        5: 'App',
        6: 'Web'
      };

      attendees = attendees.map((item) => {
        const timeSpentSeconds = item.check_out_time_epoch - item.check_in_time;

        const hasCheckOutTimeSpent =
          event.has_checkout &&
          item.check_out_time_epoch &&
          item.check_out_time_epoch !== CheckInOutTime.empty;

        const isDeletedAttendee = item.attendee_type === AttendeeType.deleted;
        const email = !isDeletedAttendee ? item.email : '-';
        const lastname = !isDeletedAttendee ? item.lastname : '-';
        const firstname = !isDeletedAttendee
          ? item.firstname
          : this.cpI18n.transform('t_shared_closed_account');

        const row = {
          [this.cpI18n.transform('t_events_csv_column_first_name')]: firstname,

          [this.cpI18n.transform('t_events_csv_column_last_name')]: lastname,

          [this.cpI18n.transform('t_events_csv_column_email')]: email,

          [this.cpI18n.transform('events_checked_in_method')]: check_in_method[
            item.check_in_method
          ],

          [this.cpI18n.transform('t_events_csv_column_check_in_date')]: CPDate.fromEpoch(
            item.check_in_time,
            this.session.tz
          ).format(Formats.dateFormat),

          [this.cpI18n.transform('t_events_csv_column_time_in')]: CPDate.fromEpoch(
            item.check_in_time,
            this.session.tz
          ).format(Formats.timeFormatLong),

          [this.cpI18n.transform('t_events_csv_column_check_out_date')]: hasCheckOutTimeSpent
            ? CPDate.fromEpoch(item.check_out_time_epoch, this.session.tz).format(
                Formats.dateFormat
              )
            : '',

          [this.cpI18n.transform('t_events_csv_column_time_out')]: hasCheckOutTimeSpent
            ? CPDate.fromEpoch(item.check_out_time_epoch, this.session.tz).format(
                Formats.timeFormatLong
              )
            : '',

          [this.cpI18n.transform('t_events_csv_column_time_spent')]: hasCheckOutTimeSpent
            ? CPDate.getTimeDuration(timeSpentSeconds).format(Formats.timeDurationFormat, {
                trim: false,
                useGrouping: false
              })
            : '',

          [this.cpI18n.transform('t_events_csv_column_time_spent_seconds')]: hasCheckOutTimeSpent
            ? timeSpentSeconds
            : '',

          [this.cpI18n.transform('ratings')]:
            item.feedback_rating === -1 ? '' : ((item.feedback_rating * 5) / 100).toFixed(2),

          [this.cpI18n.transform(
            't_events_csv_column_feedback_question'
          )]: event.custom_basic_feedback_label,

          [this.cpI18n.transform('events_user_feedback')]: item.feedback_text
        };

        if (showStudentIds) {
          row[this.cpI18n.transform('student_id')] = item.student_identifier;
        }

        return row;
      });

      createSpreadSheet(attendees, columns);
    });
  }

  displaySelfCheckInLink({ attend_verification_methods }) {
    return (
      attend_verification_methods && attend_verification_methods.includes(CheckInMethod.deepLink)
    );
  }
}
