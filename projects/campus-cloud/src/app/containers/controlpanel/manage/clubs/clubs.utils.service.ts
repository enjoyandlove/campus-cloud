import { Injectable } from '@angular/core';

import { IClub } from './club.interface';
import { ClubStatus, HasData } from './club.status';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';

import {
  canStoreReadResource,
  canSchoolReadResource,
  canSchoolWriteResource,
  canStoreReadAndWriteResource
} from '@campus-cloud/shared/utils';

@Injectable()
export class ClubsUtilsService {
  isSJSU(club: IClub) {
    return 'advisor_firstname' in club;
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

  setEventProperties(data, club_type) {
    return {
      club_id: data.id,
      phone: this.hasData(data.phone),
      email: this.hasData(data.email),
      website: this.hasData(data.website),
      location: this.hasData(data.location),
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
      links = ['Events', ...links];
    }

    if (club.has_membership) {
      if (clubIsPending && schoolOrStoreAccess(CP_PRIVILEGES_MAP.moderation)) {
        links = ['Feeds', ...links];
      }

      if (schoolOrStoreAccess(CP_PRIVILEGES_MAP.membership)) {
        links = ['Members', ...links];
      }
    }

    links = ['Info', ...links];

    return links;
  }
}
