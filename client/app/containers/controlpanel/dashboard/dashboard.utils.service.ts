import { CPSession } from './../../../session/index';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { CPDate } from './../../../shared/utils/date/date';
import { CPI18nService } from './../../../shared/services/i18n.service';

const cpI18n = new CPI18nService();

const todayDate = moment().endOf('day');
const yesterdayDate = todayDate.clone().subtract(1, 'days');
const yesterdayEnd = (tz) => CPDate.toEpoch(yesterdayDate, tz);

const last30Days = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
      .subtract(30, 'days')
      .startOf('day'),
    tz
  );

const last90Days = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
      .subtract(90, 'days')
      .startOf('day'),
    tz
  );

const lastYear = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
      .subtract(1, 'year')
      .startOf('day'),
    tz
  );

@Injectable()
export class DashboardUtilsService {
  constructor(public session: CPSession) {}
  isSuperAdmin(session) {
    return session.isSuperAdmin;
  }

  dayStart(date) {
    return CPDate.toEpoch(moment(date).startOf('day'), this.session.tz);
  }

  dayEnd(date) {
    return CPDate.toEpoch(moment(date).endOf('day'), this.session.tz);
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
      end: yesterdayEnd(this.session.tz),
      start: lastYear(this.session.tz),
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
}
