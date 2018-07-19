import { Injectable } from '@angular/core';

import { MemberType } from './member.status';
import { CPI18nService } from '../../../../../shared/services/i18n.service';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

@Injectable()
export class MembersUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  getMemberType(isOrientation: boolean = null) {
    return isOrientation ? this.cpI18n.translate('leader') : this.cpI18n.translate('executive');
  }

  getMemberTypeLabel(type) {
    return type === MemberType.member
      ? amplitudeEvents.MEMBER
      : amplitudeEvents.EXECUTIVE;

  }
}
