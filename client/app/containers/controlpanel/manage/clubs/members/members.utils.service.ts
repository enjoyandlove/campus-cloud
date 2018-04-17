import { Injectable } from '@angular/core';
import { CPI18nService } from '../../../../../shared/services/i18n.service';

@Injectable()
export class MembersUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  getMemberType(isOrientation: boolean = null) {
    return isOrientation
      ? this.cpI18n.translate('leader')
      : this.cpI18n.translate('executive');
  }
}
