import { take, map } from 'rxjs/internal/operators';
import { select, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import * as fromStore from '@controlpanel/manage/feeds/store';
import { StoreCategoryType } from '@campus-cloud/shared/models';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';

enum hasData {
  yes = 'Yes',
  no = 'No'
}

enum wallType {
  manual = 'Manual',
  integration = 'Feed Integration'
}

export const dateAmplitudeLabel = {
  custom: amplitudeEvents.CUSTOM,
  lastYear: amplitudeEvents.LAST_YEAR,
  lastWeek: amplitudeEvents.LAST_7_DAYS,
  last30Days: amplitudeEvents.LAST_30_DAYS,
  last90Days: amplitudeEvents.LAST_90_DAYS
};

@Injectable()
export class FeedsAmplitudeService {
  _filterLabel: string;

  constructor(
    private session: CPSession,
    private cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>
  ) {}

  get filterLabel() {
    return this._filterLabel;
  }

  getViewFilters() {
    return this.store.pipe(select(fromStore.getViewFilters)).pipe(take(1));
  }

  getWallSource() {
    let amplitude = 'Not Applicable';

    if (!this.isWallMenu()) {
      return amplitude;
    }

    this.getViewFilters()
      .pipe(
        map(({ postType, group }) => {
          const storeCategoryId = group ? group.store_category_id : null;
          const isIntegrated = (postType && postType.is_integrated) || false;
          // storeCategoryId can be 0 as well to avoid failing condition we are checking integer
          if (Number.isInteger(storeCategoryId)) {
            amplitude = FeedsAmplitudeService.storeCategoryIdToAmplitudeName(storeCategoryId);
          } else if (!postType) {
            amplitude = amplitudeEvents.All_CATEGORIES;
          } else if (isIntegrated) {
            amplitude = amplitudeEvents.INTEGRATED_FEED_CHANNEL;
          } else {
            this.store
              .select(fromStore.getSocialPostCategories)
              .pipe(take(1))
              .subscribe((channels) => {
                amplitude = channels.find((c) => c.id === postType.id).name;
              });
          }
        })
      )
      .subscribe();

    return amplitude;
  }

  getPostCreationSource(postTypeId) {
    let isIntegrated = false;

    if (!this.isWallMenu()) {
      return wallType.manual;
    }

    this.store
      .select(fromStore.getSocialPostCategories)
      .pipe(take(1))
      .subscribe((channels) => {
        isIntegrated = channels.find((c) => c.id === postTypeId).is_integrated;
      });

    return isIntegrated ? wallType.integration : wallType.manual;
  }

  getPostType() {
    let amplitude = '';
    this.getViewFilters()
      .pipe(
        map(({ flaggedByUser }) => {
          amplitude = flaggedByUser ? amplitudeEvents.FLAGGED : amplitudeEvents.DEFAULT;
        })
      )
      .subscribe();

    return amplitude;
  }

  getUserFilter() {
    let amplitude = hasData.no;
    this.getViewFilters()
      .pipe(
        map(({ users }) => {
          const hasUser = users ? users.length : null;
          amplitude = hasUser ? hasData.yes : hasData.no;
        })
      )
      .subscribe();

    return amplitude;
  }

  setFilterLabel(dateLabel, state) {
    const { start, end } = state;
    const dateDefaultLabel = start && end ? amplitudeEvents.CUSTOM : 'All Time';
    this._filterLabel = dateLabel ? dateAmplitudeLabel[dateLabel] : dateDefaultLabel;
  }

  getWallCommonAmplitudeProperties(feed) {
    const amplitude = this.getAllWallAmplitude(feed);
    return omit(amplitude, ['post_type', 'date_filter', 'user_filter']);
  }

  getWallFiltersAmplitude() {
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties();

    return {
      sub_menu_name,
      post_type: this.getPostType(),
      date_filter: this.filterLabel,
      user_filter: this.getUserFilter(),
      wall_source: this.getWallSource()
    };
  }

  getAllWallAmplitude(feed) {
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties();

    return {
      sub_menu_name,
      post_id: feed.id,
      post_type: this.getPostType(),
      date_filter: this.filterLabel,
      wall_source: this.getWallSource(),
      user_filter: this.getUserFilter(),
      likes: FeedsAmplitudeService.hasData(feed.likes),
      creation_source: this.getPostCreationSource(feed.post_type),
      comments: FeedsAmplitudeService.hasData(feed.comment_count),
      upload_image: FeedsAmplitudeService.hasImage(feed.has_image)
    };
  }

  getWallPostFeedAmplitude(feed, host_type) {
    const { post_id, upload_image } = this.getAllWallAmplitude(feed);
    const { post_type, wall_source, sub_menu_name } = this.getWallFiltersAmplitude();

    return {
      post_id,
      host_type,
      post_type,
      wall_source,
      sub_menu_name,
      upload_image
    };
  }

  getWallPostCommentAmplitude(feed, host_type) {
    const {
      likes,
      wall_source,
      sub_menu_name,
      creation_source,
      upload_image
    } = this.getAllWallAmplitude(feed);

    return {
      likes,
      host_type,
      wall_source,
      upload_image,
      sub_menu_name,
      creation_source,
      comment_id: feed.id
    };
  }

  getWallThreadAmplitude(feed, thread_type) {
    let amplitude;
    amplitude = this.getAllWallAmplitude(feed);
    amplitude = omit(amplitude, ['post_id', 'comments']);

    return {
      ...amplitude,
      thread_type,
      thread_id: feed.id
    };
  }

  getWallMutedUserAmplitude(user) {
    const restricted = user.social_restriction_school_ids.includes(this.session.school.id);

    const {
      sub_menu_name,
      wall_source,
      post_type,
      date_filter,
      user_filter
    } = this.getWallFiltersAmplitude();

    return {
      post_type,
      wall_source,
      date_filter,
      user_filter,
      sub_menu_name,
      user_id: user.id,
      status: restricted ? 'Muted' : 'Unmuted'
    };
  }

  getWallViewedImageAmplitude(feed, isComment) {
    const thread_type = isComment ? amplitudeEvents.COMMENT : amplitudeEvents.POST;

    return {
      ...this.getWallFiltersAmplitude(),
      thread_type,
      thread_id: feed.id,
      total_images: feed.image_url_list.length,
      creation_source: this.getPostCreationSource(feed.post_type)
    };
  }

  isWallMenu() {
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties();
    return sub_menu_name === 'Walls';
  }

  static storeCategoryIdToAmplitudeName(storeCategory) {
    if (storeCategory === StoreCategoryType.athletics) {
      return 'Athletic Channel';
    } else if (storeCategory === StoreCategoryType.club) {
      return 'Club Channel';
    } else if (storeCategory === StoreCategoryType.services) {
      return 'Service Channel';
    }

    return null;
  }

  static hasData(data) {
    return data > 0 ? hasData.yes : hasData.no;
  }

  static hasImage(image) {
    return image ? hasData.yes : hasData.no;
  }
}
