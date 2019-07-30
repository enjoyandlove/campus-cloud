import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment-timezone';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';

const FORMAT_EN = {
  TIME: 'h:mm A',
  SHORT: 'MMM D, YYYY',
  LONG: 'dddd, MMMM Do, YYYY',
  DATETIME: 'MMM D, YYYY h:mm a',
  DATETIME_SHORT: 'MM/DD/YYYY, h:mm a'
};

const FORMAT_FR = {
  TIME: 'HH:mm',
  SHORT: 'D MMMM YYYY',
  LONG: 'dddd D MMMM YYYY',
  DATETIME: 'D MMMM YYYY HH:mm',
  DATETIME_SHORT: 'D/MM/YYYY, HH[h]mm'
};

const locale = CPI18nService.getLocale();

export const FORMAT = locale === 'fr-CA' ? FORMAT_FR : FORMAT_EN;

@Pipe({ name: 'cpDatePipe' })
export class CPDatePipe implements PipeTransform {
  constructor(public session: CPSession) {}
  transform(date: number, format: string, timezone?: string) {
    moment.locale(CPI18nService.getLocale());

    return moment.tz(moment.unix(date), timezone ? timezone : this.session.tz).format(format);
  }
}
