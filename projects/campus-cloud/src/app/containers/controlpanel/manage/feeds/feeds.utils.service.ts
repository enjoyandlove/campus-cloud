import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';

enum hasData {
  yes = 'Yes',
  no = 'No'
}

export enum WallPage {
  yes = 'Yes',
  no = 'No'
}

export enum GroupType {
  campus = 0,
  club = 1,
  athletics = 2,
  orientation = 3,
  service = 4
}

@Injectable()
export class FeedsUtilsService {
  constructor() {}

  hasImage(image) {
    return image ? hasData.yes : hasData.no;
  }

  wallPage(groupType: GroupType) {
    if (groupType === GroupType.athletics) {
      return amplitudeEvents.ATHLETICS;
    } else if (groupType === GroupType.orientation) {
      return amplitudeEvents.ORIENTATION;
    } else if (groupType === GroupType.club) {
      return amplitudeEvents.CLUB;
    }

    return amplitudeEvents.WALL;
  }

  hasLikes(likes) {
    return likes > 0 ? hasData.yes : hasData.no;
  }

  hasComments(comments) {
    return comments > 0 ? hasData.yes : hasData.no;
  }
}
