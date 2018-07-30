import { Injectable } from '@angular/core';

import { amplitudeEvents } from '../../../../shared/constants/analytics';

enum hasData {
  yes = 'Yes',
  no = 'No'
}

export enum WallPage {
  yes = 'Yes',
  no = 'No'
}

@Injectable()
export class FeedsUtilsService {
  constructor() {}

  hasImage(image) {
    return image ? hasData.yes : hasData.no;
  }

  wallSource(athleticId: number, orientationId: number, clubId: number) {
    if (athleticId) {
      return amplitudeEvents.ATHLETICS;
    } else if (orientationId) {
      return amplitudeEvents.ORIENTATION;
    } else if (clubId) {
      return amplitudeEvents.CLUB;
    }

    return amplitudeEvents.CAMPUS;
  }

  hasLikes(likes) {
    return likes > 0 ? hasData.yes : hasData.no;
  }

  hasComments(comments) {
    return comments > 0 ? hasData.yes : hasData.no;
  }

  isWallPage(club, athletic, orientation) {
    const wall = !club && !athletic && !orientation;

    return wall ? WallPage.yes : WallPage.no;
  }
}
