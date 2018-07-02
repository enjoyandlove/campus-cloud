import { CPSession } from './../../../session/index';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CPDate } from '../../utils/date/date';

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
