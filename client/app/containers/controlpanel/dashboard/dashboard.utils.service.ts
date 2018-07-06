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

const cpI18n = new CPI18nService();

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
      start: last30Days(this.session.tz, yesterdayEnd(this.session.tz)),
      label: cpI18n.translate('dashboard_last_30_days')
    };
  }

  last90Days() {
    return {
      end: yesterdayEnd(this.session.tz),
      start: last90Days(this.session.tz, yesterdayEnd(this.session.tz)),
      label: cpI18n.translate('dashboard_last_90_days')
    };
  }

  lastYear() {
    return {
      end: yesterdayEnd(this.session.tz),
      start: lastYear(this.session.tz, yesterdayEnd(this.session.tz)),
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
