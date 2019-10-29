import { Injectable } from '@angular/core';

import { IItem } from '@campus-cloud/shared/components';
import { CPI18nService } from '@campus-cloud/shared/services';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { createSpreadSheet } from '@campus-cloud/shared/utils/csv';
import { IMember, MemberType } from '@campus-cloud/libs/members/common/model';

@Injectable()
export class LibsCommonMembersUtilsService {
  constructor(private cpI18n: CPI18nService, private cpTracking: CPTrackingService) {}

  getMemberDropdown(executiveLeader: string): IItem[] {
    return [
      {
        label: this.cpI18n.translate('member'),
        action: MemberType.member
      },
      {
        label: this.cpI18n.translate(executiveLeader),
        action: MemberType.executive_leader
      }
    ];
  }

  getMemberTypeLabel(type: number) {
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

  trackMemberEdit(member: IMember) {
    const eventProperties = {
      member_id: member.id,
      member_type: this.getMemberTypeLabel(member.member_type)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_UPDATED_CLUB_MEMBER, eventProperties);
  }

  trackMemberCreate(member: IMember) {
    const eventProperties = {
      member_id: member.id,
      member_type: this.getMemberTypeLabel(member.member_type)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_ADDED_CLUB_MEMBER, eventProperties);
  }

  trackMemberDelete() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.cpTracking.getAmplitudeMenuProperties()
    );
  }
}
