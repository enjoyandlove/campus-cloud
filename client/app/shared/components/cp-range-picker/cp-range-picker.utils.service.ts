import { CPSession } from './../../../session/index';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CPDate } from '../../utils/date/date';

const todayDate = moment().endOf('day');
const yesterdayDate = todayDate.clone().subtract(1, 'days');

export const now = (tz) => CPDate.now(tz).unix();

export const yesterdayEnd = (tz) => CPDate.toEpoch(yesterdayDate, tz);

export const last30Days = (tz, startDate) =>
  CPDate.toEpoch(
    moment(startDate)
      .subtract(30, 'days')
      .startOf('day'),
    tz
  );

export const last90Days = (tz, startDate) =>
  CPDate.toEpoch(
    moment(startDate)
      .subtract(90, 'days')
      .startOf('day'),
    tz
  );

export const lastYear = (tz, startDate) =>
  CPDate.toEpoch(
    moment(startDate)
      .subtract(1, 'year')
      .startOf('day'),
    tz
  );

@Injectable()
export class CPRangePickerUtilsService {
  constructor(public session: CPSession) {}

  dayStart(date) {
    return CPDate.toEpoch(moment(date).startOf('day'), this.session.tz);
  }

  dayEnd(date) {
    return CPDate.toEpoch(moment(date).endOf('day'), this.session.tz);
  }
}
