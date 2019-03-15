import { CPSession } from './../../../session/index';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { CPDate } from './../../../shared/utils/date/date';
import { CPI18nService } from './../../../shared/services/i18n.service';
import {
  lastYear,
  last90Days,
  last30Days,
  yesterdayEnd
} from '../../../shared/components/cp-range-picker/cp-range-picker.utils.service';
import { Params } from '@angular/router';

const cpI18n = new CPI18nService();
const todayDate = moment().endOf('day');
const yesterdayDate = todayDate.clone().subtract(1, 'days');

@Injectable()
export class DashboardUtilsService {
  constructor(public session: CPSession) {}
  isSuperAdmin(session) {
    return session.isSuperAdmin;
  }

  dayStart(date) {
    return CPDate.toEpoch(moment(date).startOf('day'), this.session.tz);
  }

  validParams(params: Params) {
    const { start, end, label, cga_exp_id } = params;

    return start && end && label && cga_exp_id;
  }

  dayEnd(date) {
    return CPDate.toEpoch(moment(date).endOf('day'), this.session.tz);
  }

  last30Days() {
    return {
      end: yesterdayEnd(this.session.tz),
      start: last30Days(this.session.tz, yesterdayDate),
      label: cpI18n.translate('dashboard_last_30_days')
    };
  }

  last90Days() {
    return {
      end: yesterdayEnd(this.session.tz),
      start: last90Days(this.session.tz, yesterdayDate),
      label: cpI18n.translate('dashboard_last_90_days')
    };
  }

  lastYear() {
    return {
      end: yesterdayEnd(this.session.tz),
      start: lastYear(this.session.tz, yesterdayDate),
      label: cpI18n.translate('dashboard_last_year')
    };
  }

  allTime() {
    return {
      end: yesterdayEnd(this.session.tz),
      start: 1,
      label: cpI18n.translate('dashboard_all_time')
    };
  }

  parseOrientationResponse(items: Array<any>) {
    if (!items) {
      return new Promise(() => []);
    }
    return new Promise((resolve) => {
      resolve(
        items.map((item) => {
          return {
            image: '',
            id: item.calendar_id,
            name: item.calendar_name,
            feedback: item.num_of_feedbacks,
            attendees: item.num_of_attendees,
            rating: item.average_of_feedbacks,
            resourceUrl: `/manage/orientation/${item.calendar_id}/events`
          };
        })
      );
    });
  }

  parseEventsResponse(items: Array<any>) {
    if (!items) {
      return new Promise(() => []);
    }
    return new Promise((resolve) => {
      resolve(
        items.map((item) => {
          return {
            id: item.event_id,
            name: item.event_title,
            image: item.event_poster_thumb_url,
            attendees: item.num_of_attendees,
            feedback: item.num_of_feedbacks,
            rating: item.average_of_feedbacks,
            resourceUrl: `/manage/events/${item.event_id}`
          };
        })
      );
    });
  }

  parseServicesResponse(items: Array<any>) {
    if (!items) {
      return new Promise(() => []);
    }
    return new Promise((resolve) => {
      resolve(
        items.map((item) => {
          return {
            id: item.campus_service_id,
            name: item.service_name,
            image: item.service_logo_url,
            attendees: item.num_of_attendees,
            feedback: item.num_of_feedbacks,
            rating: item.average_of_feedbacks,
            resourceUrl: `/manage/services/${item.campus_service_id}`
          };
        })
      );
    });
  }
}
