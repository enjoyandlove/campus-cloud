import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'cpStatsFormatter'})
export class CPStatsFormatterPipe implements PipeTransform {
  transform(value: any): any {
    if (value.toString().length >= 5) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value;
  }
}
