import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants';

@Injectable()
export class FeedsAmplitudeService {
  static getWallSource({ isCampusThread }) {
    return isCampusThread ? amplitudeEvents.CAMPUS_WALL : amplitudeEvents.OTHER_WALLS;
  }

  static getPostType({ flagged_by_users_only }) {
    return flagged_by_users_only ? amplitudeEvents.FLAGGED_POSTS : amplitudeEvents.ALL_POSTS;
  }
}
