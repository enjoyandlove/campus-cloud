import { Injectable } from '@angular/core';

import { CPSession } from '../../../session';
import { Formats } from '../../../shared/utils/csv';
import { CPDate } from '../../../shared/utils/date';
import { CPI18nService } from '../../../shared/services';
import { CheckInOutTime } from '../manage/events/event.status';
import { createSpreadSheet } from '../../../shared/utils/csv/parser';
import { amplitudeEvents } from '../../../shared/constants/analytics';

const EventType = {
  event: 'event',
  service: 'service',
  orientation: 'user_event'
};

@Injectable()
export class AssessUtilsService {
  constructor(public cpI18n: CPI18nService, public session: CPSession) {}

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

  getLastEngaged(student) {
    let lastEvent = student.last_event;
    let lastService = student.last_service;
    let lastOrientation = student.last_orientation_event;

    lastEvent = lastEvent > lastService && lastEvent > lastOrientation ? lastEvent : null;
    lastService = lastService > lastEvent && lastService > lastOrientation ? lastService : null;
    lastOrientation =
      lastOrientation > lastEvent && lastOrientation > lastService ? lastOrientation : null;

    return lastEvent ? lastEvent : lastService ? lastService : lastOrientation;
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

  createExcel(stream, student) {
    const columns = [
      this.cpI18n.translate('assess_check_in_time'),
      this.cpI18n.translate('t_shared_type'),
      this.cpI18n.translate('assess_checkin_date'),
      this.cpI18n.translate('t_assess_checkin_time_in'),
      this.cpI18n.translate('t_assess_checkout_date'),
      this.cpI18n.translate('t_assess_checkout_time_out'),
      this.cpI18n.translate('t_assess_time_spent'),
      this.cpI18n.translate('t_assess_time_spent_seconds'),
      this.cpI18n.translate('assess_response_date'),
      this.cpI18n.translate('ratings'),
      this.cpI18n.translate('response')
    ];

    const type = {
      event: this.cpI18n.translate('event'),
      service: this.cpI18n.translate('service')
    };

    stream.toPromise().then((data: any) => {
      data = data.map((item) => {
        const timeSpentSeconds = item.check_out_time_epoch - item.time_epoch;

        const hasCheckOutTimeSpent =
          item.check_out_time_epoch && item.check_out_time_epoch !== CheckInOutTime.empty;

        return {
          [this.cpI18n.translate('assess_check_in_time')]: item.name,

          [this.cpI18n.translate('t_shared_type')]: type[item.type],

          [this.cpI18n.translate('assess_checkin_date')]: CPDate.fromEpoch(
            item.time_epoch,
            this.session.tz
          ).format(Formats.dateFormat),

          [this.cpI18n.translate('t_assess_checkin_time_in')]: CPDate.fromEpoch(
            item.time_epoch,
            this.session.tz
          ).format(Formats.timeFormatLong),

          [this.cpI18n.translate('t_assess_checkout_date')]: hasCheckOutTimeSpent
            ? CPDate.fromEpoch(item.check_out_time_epoch, this.session.tz).format(
                Formats.dateFormat
              )
            : '',

          [this.cpI18n.translate('t_assess_checkout_time_out')]: hasCheckOutTimeSpent
            ? CPDate.fromEpoch(item.check_out_time_epoch, this.session.tz).format(
                Formats.timeFormatLong
              )
            : '',

          [this.cpI18n.translate('t_assess_time_spent')]: hasCheckOutTimeSpent
            ? CPDate.getTimeDuration(timeSpentSeconds).format(Formats.timeDurationFormat, {
                trim: false,
                useGrouping: false
              })
            : '',

          [this.cpI18n.translate('t_assess_time_spent_seconds')]: hasCheckOutTimeSpent
            ? timeSpentSeconds
            : '',

          [this.cpI18n.translate('assess_response_date')]:
            item.feedback_time_epoch === 0
              ? 'No Feedback Provided'
              : CPDate.fromEpoch(item.feedback_time_epoch, this.session.tz).format(
                  Formats.dateTimeFormat
                ),

          [this.cpI18n.translate('ratings')]:
            item.user_rating_percent === -1
              ? 'No Rating Provided'
              : (item.user_rating_percent / 100 * 5).toFixed(1),
          [this.cpI18n.translate('response')]: item.user_feedback_text
        };
      });

      createSpreadSheet(data, columns, `${student.firstname} ${student.lastname}`);
    });
  }
}
