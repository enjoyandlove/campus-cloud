import { CPSession } from './../../../session/index';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CPDate } from '../../utils/date/date';

const todayDate = moment().endOf('day');
const yesterdayDate = todayDate.clone().subtract(1, 'days');

export const yesterdayEnd = (tz) => CPDate.toEpoch(yesterdayDate, tz);

export const last30Days = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
      .subtract(30, 'days')
      .startOf('day'),
    tz
  );

export const last90Days = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
      .subtract(90, 'days')
      .startOf('day'),
    tz
  );

export const lastYear = (tz) =>
  CPDate.toEpoch(
    moment(yesterdayDate)
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
