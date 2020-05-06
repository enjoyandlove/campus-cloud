import { take, map } from 'rxjs/internal/operators';
import { select, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { omit } from 'lodash';

import { CPSession } from '@campus-cloud/session';
import { Feed } from '@controlpanel/manage/feeds/model';
import { FeedsUtilsService } from './feeds.utils.service';
import { InteractionLikeType } from '@campus-cloud/services';
import * as fromStore from '@controlpanel/manage/feeds/store';
import { StoreCategoryType } from '@campus-cloud/shared/models';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService } from '@campus-cloud/shared/services';

export enum CommunityAmplitudeEvents {
  VIEWED_USER_LIST = 'Community - Viewed User List'
}

enum hasData {
  yes = 'Yes',
  no = 'No'
}

enum wallType {
  manual = 'Manual',
  integration = 'Feed Integration'
}

enum DateFilterLabel {
  allTime = 'All Time'
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

  static postType(flaggedByUser, flaggedByModerators) {
    if (flaggedByUser) {
      return amplitudeEvents.FLAGGED;
    } else if (flaggedByModerators) {
      return amplitudeEvents.REMOVED;
    }

    return amplitudeEvents.DEFAULT;
  }

  constructor(
    private session: CPSession,
    private cpTracking: CPTrackingService,
    private store: Store<fromStore.IWallsState>
  ) {}

  get filterLabel() {
    return this._filterLabel;
  }

  private track(eventName: string, props?: { [key: string]: any }) {
    this.cpTracking.amplitudeEmitEvent(eventName, props);
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
        const postCategory = channels.find((c) => c.id === postTypeId);
        isIntegrated = postCategory ? postCategory.is_integrated : false;
      });

    return isIntegrated ? wallType.integration : wallType.manual;
  }

  getPostType() {
    let amplitude = '';
    this.getViewFilters()
      .pipe(
        map(({ flaggedByUser, flaggedByModerators }) => {
          amplitude = FeedsAmplitudeService.postType(flaggedByUser, flaggedByModerators);
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
    const dateDefaultLabel = start && end ? amplitudeEvents.CUSTOM : DateFilterLabel.allTime;
    this._filterLabel = dateLabel ? dateAmplitudeLabel[dateLabel] : dateDefaultLabel;
  }

  getWallCommonAmplitudeProperties(feed) {
    const amplitude = this.getAllWallAmplitude(feed);
    return omit(amplitude, ['post_type', 'date_filter', 'user_filter']);
  }

  getWallFiltersAmplitude() {
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties();
    const date_filter = this.filterLabel ? this.filterLabel : DateFilterLabel.allTime;

    return {
      date_filter,
      sub_menu_name,
      post_type: this.getPostType(),
      user_filter: this.getUserFilter(),
      wall_source: this.getWallSource()
    };
  }

  getAllWallAmplitude(feed) {
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties();
    const creation_source =
      feed.user_id > 0 ? 'App User' : this.getPostCreationSource(feed.post_type);

    const date_filter = this.filterLabel ? this.filterLabel : DateFilterLabel.allTime;

    return {
      date_filter,
      sub_menu_name,
      creation_source,
      post_id: feed.id,
      post_type: this.getPostType(),
      wall_source: this.getWallSource(),
      user_filter: this.getUserFilter(),
      likes: FeedsAmplitudeService.hasData(feed.likes),
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
    const creation_source =
      feed.user_id > 0 ? 'App User' : this.getPostCreationSource(feed.post_type);

    return {
      ...this.getWallFiltersAmplitude(),
      thread_type,
      creation_source,
      thread_id: feed.id,
      total_images: feed.image_url_list.length
    };
  }

  isWallMenu() {
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties();
    return sub_menu_name === 'Walls';
  }

  trackViewedUserList(feed: Feed, likeType: InteractionLikeType) {
    const { wall_source, post_type, date_filter, user_filter } = this.getWallFiltersAmplitude();
    const props = {
      post_type,
      user_filter,
      wall_source,
      date_filter,
      source: likeType === InteractionLikeType.like ? 'Likes' : 'Flags',
      thread_type: FeedsUtilsService.isComment(feed) ? 'Comment' : 'Post',
      image: feed.has_image ? 'Yes' : 'No'
    };

    this.track(CommunityAmplitudeEvents.VIEWED_USER_LIST, props);
  }

  getAddedImageAmplitude(feed, isComment) {
    const thread_type = isComment ? amplitudeEvents.COMMENT : amplitudeEvents.POST;
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties();

    return {
      thread_type,
      sub_menu_name,
      thread_id: feed.id,
      count: feed.image_url_list.length
    };
  }
}
