import { Pipe, PipeTransform } from '@angular/core';

import { stopWords } from '@campus-cloud/shared/constants/stop-words';

@Pipe({
  name: 'cpBoldify'
})
export class CPBoldifyPipe implements PipeTransform {
  replace(sentence, pattern) {
    if (stopWords.includes(pattern)) {
      return sentence;
    }

    const re = new RegExp(`${pattern}`, 'gi');
    sentence = sentence.replace(re, `<strong>${pattern}</strong>`);
    return sentence;
  }

  transform(value: any, match: string): any {
    if (!match) {
      return value;
    }

    match.split(' ').forEach((p) => (value = this.replace(value, p)));

    return value;
  }
}
