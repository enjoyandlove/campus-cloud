import { CPSession } from './../../../session/index';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { CPDate } from './../../../shared/utils/date/date';
import { CPI18nService } from './../../../shared/services/i18n.service';

const cpI18n = new CPI18nService();

const todayDate = moment()
  .hours(23)
  .minutes(59)
  .seconds(59);
const yesterdayDate = moment(todayDate).subtract(1, 'days');
const yesterdayEnd = (tz) => CPDate.toEpoch(yesterdayDate.toDate(), tz);

const last30Days = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
      .subtract(30, 'days')
      .hours(0)
      .minutes(0)
      .seconds(0),
    tz
  );

const last90Days = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
      .subtract(90, 'days')
      .hours(0)
      .minutes(0)
      .seconds(0),
    tz
  );

const lastYear = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
      .subtract(1, 'year')
      .hours(0)
      .minutes(0)
      .seconds(0),
    tz
  );

@Injectable()
export class DashboardUtilsService {
  constructor(public session: CPSession) {}
  isSuperAdmin(session) {
    return session.isSuperAdmin;
  }

  dayStart(date) {
    return CPDate.toEpoch(
      moment(date)
        .hours(0)
        .minutes(0)
        .seconds(0),
      this.session.tz
    );
  }

  dayEnd(date) {
    return CPDate.toEpoch(
      moment(date)
        .hours(23)
        .minutes(59)
        .seconds(59)
        .toDate(),
      this.session.tz
    );
  }

  last30Days() {
    return {
      end: yesterdayEnd(this.session.tz),
      start: last30Days(this.session.tz),
      label: cpI18n.translate('dashboard_last_30_days')
    };
  }

  last90Days() {
    return {
      end: yesterdayEnd(this.session.tz),
      start: last90Days(this.session.tz),
      label: cpI18n.translate('dashboard_last_90_days')
    };
  }

  lastYear() {
    return {
      end: yesterdayEnd,
      start: lastYear(this.session.tz),
      label: cpI18n.translate('dashboard_last_year')
    };
  }

  allTime() {
    return {
      end: yesterdayEnd,
      start: 1,
      label: cpI18n.translate('dashboard_all_time')
    };
  }
}
