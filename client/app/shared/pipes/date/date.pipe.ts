import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

export const FORMAT = {
  'SHORT': 'MMM Do YY',
  'LONG': 'dddd, MMMM D, YYYY',
  'DATETIME': 'MMMM Do YYYY, h:mm a',
  'TIME': 'h:mm A'
};

@Pipe({name: 'cpDatePipe'})
export class CPDatePipe implements PipeTransform {
  transform(date: number, format: string) {
    return moment.unix(date).format(format);
  }
}
