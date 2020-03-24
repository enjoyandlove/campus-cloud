import { take, map } from 'rxjs/internal/operators';
import { select, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';

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

@Injectable()
export class FeedsAmplitudeService {
  constructor(private cpTracking: CPTrackingService, private store: Store<fromStore.IWallsState>) {}

  getWallSource() {
    let amplitude = 'Not Applicable';

    if (!this.isWallMenu()) {
      return amplitude;
    }

    this.store
      .pipe(select(fromStore.getViewFilters))
      .pipe(
        take(1),
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

  getWallAmplitudeProperties() {
    const { sub_menu_name } = this.cpTracking.getAmplitudeMenuProperties();
    return {
      sub_menu_name,
      post_type: this.getPostType(),
      wall_source: this.getWallSource()
    };
  }

  getWallCommonAmplitudeProperties(feed) {
    const { wall_source, post_type, sub_menu_name } = this.getWallAmplitudeProperties();
    return {
      post_type,
      wall_source,
      sub_menu_name,
      post_id: feed.id,
      likes: FeedsAmplitudeService.hasData(feed.likes),
      creation_source: this.getPostCreationSource(feed.post_type),
      comments: FeedsAmplitudeService.hasData(feed.comment_count),
      upload_image: FeedsAmplitudeService.hasImage(feed.has_image)
    };
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
    this.store
      .pipe(select(fromStore.getViewFilters))
      .pipe(
        take(1),
        map(({ flaggedByUser }) => {
          amplitude = flaggedByUser ? amplitudeEvents.FLAGGED : amplitudeEvents.DEFAULT;
        })
      )
      .subscribe();

    return amplitude;
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
