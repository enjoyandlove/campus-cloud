import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

import { CPI18nService } from '../../services/index';

const FORMAT_EN = {
  SHORT: 'MMM Do, YYYY',
  LONG: 'dddd, MMMM Do, YYYY',
  DATETIME: 'MMMM Do YYYY, h:mm a',
  TIME: 'h:mm A',
};

const FORMAT_FR = {
  SHORT: 'D MMMM YYYY',
  LONG: 'dddd D MMMM YYYY',
  DATETIME: 'D MMMM YYYY HH:mm',
  TIME: 'HH:mm',
};

const locale = CPI18nService.getLocale();

export const FORMAT = locale === 'fr-CA' ? FORMAT_FR : FORMAT_EN;

@Pipe({ name: 'cpDatePipe' })
export class CPDatePipe implements PipeTransform {
  transform(date: number, format: string) {
    moment.locale(CPI18nService.getLocale());

    return moment.unix(date).format(format);
  }
}
