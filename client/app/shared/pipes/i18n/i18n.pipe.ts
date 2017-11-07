import { Pipe, PipeTransform } from '@angular/core';

import { CPI18nService } from '../../services/i18n.service';

const cpI18n = new CPI18nService();

@Pipe({name: 'cpI18n'})
export class CPI18nPipe implements PipeTransform {
  transform(key: string): any { return cpI18n.translate(key); }
}
