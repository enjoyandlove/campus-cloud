import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { IClub } from './club.interface';
import { ClubStatus, hasData } from './club.status';
import { CP_PRIVILEGES_MAP } from './../../../../shared/constants/privileges';

import {
  canStoreReadResource,
  canSchoolReadResource,
  canSchoolWriteResource,
  canStoreReadAndWriteResource
} from './../../../../shared/utils/privileges/privileges';

@Injectable()
export class ClubsUtilsService {
  isSJSU(club: IClub) {
    return _get(club, 'advisor_firstname', false);
  }

  limitedAdmin(sessionG, storeId) {
    return (
      !canStoreReadAndWriteResource(sessionG, storeId, CP_PRIVILEGES_MAP.clubs) &&
      !canSchoolWriteResource(sessionG, CP_PRIVILEGES_MAP.clubs)
    );
  }

  getData(data) {
    return data ? hasData.yes : hasData.no;
  }

  setEventProperties(data, club_type) {
    return {
      club_type,
      club_id: data.id,
      phone: this.getData(data.phone),
      email: this.getData(data.email),
      website: this.getData(data.website),
      location: this.getData(data.location)
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
