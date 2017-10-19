import { Pipe, PipeTransform } from '@angular/core';

import { unix }  from 'moment';

export const FORMAT = {
  'SHORT': 'MMM D, YYYY',
  'LONG': 'dddd, MMMM D, YYYY',
  'DATETIME': 'MMMM Do YYYY, h:mm a',
  'TIME': 'h:mm A'
};

@Pipe({name: 'cpDatePipe'})
export class CPDatePipe implements PipeTransform {
  transform(date: number, format: string) {
    return unix(date).format(format);
  }
}
