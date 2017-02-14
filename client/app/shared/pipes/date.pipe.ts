import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';

export const FORMAT = {
  'LONG': 'MMM Do YY',
  'SHORT': 'MMM Do YY',
};

@Pipe({name: 'cpDatePipe'})
export class CPDatePipe implements PipeTransform {
  transform(date: number, format: string) {
    return moment.unix(date).format(format);
  }
}
