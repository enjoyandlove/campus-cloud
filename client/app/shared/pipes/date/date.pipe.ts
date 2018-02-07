import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

import { CPI18nService } from '../../services/index';

export const FORMAT = {
  SHORT: 'MMM D, YYYY',
  LONG: 'dddd, MMMM D, YYYY',
  DATETIME: 'MMMM D YYYY, h:mm a',
  TIME: 'h:mm A',
};

@Pipe({ name: 'cpDatePipe' })
export class CPDatePipe implements PipeTransform {
  transform(date: number, format: string) {
    moment.locale(CPI18nService.getLocale());

    return moment.unix(date).format(format);
  }
}
