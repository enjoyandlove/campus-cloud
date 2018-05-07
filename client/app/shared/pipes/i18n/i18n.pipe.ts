import { Pipe, PipeTransform } from '@angular/core';

import { CPI18nService } from '../../services/i18n.service';

const cpI18n = new CPI18nService();

@Pipe({ name: 'cpI18n' })
export class CPI18nPipe implements PipeTransform {
  transform(key: string, context?: any): any {
    const translatedString = cpI18n.translate(key);

    return context ? translatedString.replace('%s', context) : translatedString;
  }
}
