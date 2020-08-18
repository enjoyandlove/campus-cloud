import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakLines'
})
export class BreakLinesPipe implements PipeTransform {

  transform(value: string, context?: any): string {
    return this.replaceAll(value, '\n', '<br>');
  }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
}
