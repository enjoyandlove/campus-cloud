import { Injectable } from '@angular/core';

import { MemberType } from './member.status';
import { IMember } from './members.interface';
import { createSpreadSheet } from '../../../../../shared/utils/csv';
import { CPI18nService } from '../../../../../shared/services/i18n.service';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

@Injectable()
export class MembersUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  getMemberType(isOrientation: boolean = null) {
    return isOrientation ? this.cpI18n.translate('leader') : this.cpI18n.translate('executive');
  }

  getMemberTypeLabel(type) {
    return type === MemberType.member ? amplitudeEvents.MEMBER : amplitudeEvents.EXECUTIVE;
  }

  createExcel(members: IMember[]) {
    const columns = ['name', 'email'].map((key) => this.cpI18n.translate(key));
    const rows = members.map((member) => {
      const row = {};
      row[this.cpI18n.translate('name')] = `${member.firstname} ${member.lastname}`;
      row[this.cpI18n.translate('email')] = member.email;

      return row;
    });
    createSpreadSheet(rows, columns);
  }
}
