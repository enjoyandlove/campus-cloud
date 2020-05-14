import { Injectable } from '@angular/core';

import { IClub } from './club.interface';
import { ClubStatus, HasData } from './club.status';
import { CPI18nService } from '@campus-cloud/shared/services';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import {
  canStoreReadResource,
  canSchoolReadResource,
  canSchoolWriteResource,
  canStoreReadAndWriteResource
} from '@campus-cloud/shared/utils';

@Injectable()
export class ClubsUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  static isSJSU(club: IClub) {
    return club ? 'advisor_firstname' in club : false;
  }

  limitedAdmin(sessionG, storeId) {
    return (
      !canStoreReadAndWriteResource(sessionG, storeId, CP_PRIVILEGES_MAP.clubs) &&
      !canSchoolWriteResource(sessionG, CP_PRIVILEGES_MAP.clubs)
    );
  }

  hasData(data) {
    return data ? HasData.yes : HasData.no;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getClubStatus(status) {
    return this.getStatusTypes().find((s) => s.action === status).label;
  }

  setEventProperties(data, club_type) {
    const membership_status = data.has_membership
      ? amplitudeEvents.ENABLED
      : amplitudeEvents.DISABLED;

    return {
      club_id: data.id,
      membership_status,
      phone: this.hasData(data.phone),
      email: this.hasData(data.email),
      website: this.hasData(data.website),
      location: this.hasData(data.location),
      club_status: this.getClubStatus(data.status),
      club_type: this.capitalizeFirstLetter(club_type)
    };
  }

  getSubNavChildren(club: IClub, session) {
    let links = [];

    const clubIsActive = club.status === ClubStatus.active;

    const clubIsPending = club.status !== ClubStatus.pending;

    const schoolAccess = (permission) => canSchoolReadResource(session.g, permission);

    const storeAccess = (permission) => {
      return canStoreReadResource(session.g, club.id, permission);
    };

    const schoolOrStoreAccess = (permission) => schoolAccess(permission) || storeAccess(permission);

    if (clubIsActive && schoolOrStoreAccess(CP_PRIVILEGES_MAP.events)) {
      links = [{ label: 'events', amplitude: 'Events' }, ...links];
    }

    if (club.has_membership) {
      if (clubIsPending && canSchoolReadResource(session.g, CP_PRIVILEGES_MAP.moderation)) {
        links = [{ label: 'feeds', amplitude: 'Walls' }, ...links];
      }

      if (canSchoolReadResource(session.g, CP_PRIVILEGES_MAP.membership)) {
        links = [{ label: 'members', amplitude: 'Members' }, ...links];
      }
    }

    links = [{ label: 'info', amplitude: 'Info' }, ...links];

    return links;
  }

  getMembershipTypes() {
    return [
      {
        action: true,
        label: this.cpI18n.translate('club_membership_enabled_title'),
        description: this.cpI18n.translate('clubs_membership_enabled')
      },
      {
        action: false,
        label: this.cpI18n.translate('club_membership_disabled_title'),
        description: this.cpI18n.translate('clubs_membership_disabled')
      }
    ];
  }

  getStatusTypes() {
    return [
      {
        action: ClubStatus.active,
        label: this.cpI18n.translate('club_status_active'),
        description: this.cpI18n.translate('clubs_status_active')
      },
      {
        action: ClubStatus.inactive,
        label: this.cpI18n.translate('club_status_inactive'),
        description: this.cpI18n.translate('clubs_status_inactive')
      },
      {
        action: ClubStatus.pending,
        label: this.cpI18n.translate('club_status_pending'),
        description: this.cpI18n.translate('clubs_status_pending')
      }
    ];
  }
}
