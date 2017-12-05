import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { CPDate } from './../../../shared/utils/date/date';
import { CPI18nService } from './../../../shared/services/i18n.service';

const cpI18n = new CPI18nService();

const today = CPDate.toEpoch(moment().hours(0).minutes(0).seconds(0).toDate());
const last30Days = CPDate.toEpoch(moment().subtract(30, 'days').hours(0).minutes(0).seconds(0));
const last90Days = CPDate.toEpoch(moment().subtract(90, 'days').hours(0).minutes(0).seconds(0));
const lastYear = CPDate.toEpoch(moment().subtract(1, 'year').hours(0).minutes(0).seconds(0));

@Injectable()
export class DashboardUtilsService {
  isSuperAdmin() {
    return true;
  }

  last30Days() {
    return {
      end: today,
      start: last30Days,
      label: cpI18n.translate('dashboard_last_30_days')
    }
  }

  last90Days() {
    return {
      end: today,
      start: last90Days,
      label: cpI18n.translate('dashboard_last_90_days')
    }
  }

  lastYear() {
    return {
      end: today,
      start: lastYear,
      label: cpI18n.translate('dashboard_last_year')
    }
  }

  allTime() {
    return {
      end: today,
      start: 1,
      label: cpI18n.translate('dashboard_all_time')
    }
  }
}
