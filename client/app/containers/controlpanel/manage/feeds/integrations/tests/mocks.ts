import { of } from 'rxjs';

import { filledForm as filledSocialPostCategory } from './../../tests/mocks';
import { IWallsIntegration } from '@client/app/libs/integrations/walls/model';

export const emptyForm = {
  school_id: 157,
  feed_url: null,
  feed_type: 1,
  poster_display_name: null,
  social_post_category_id: null,
  poster_avatar_url: null
};

export const filledForm = {
  school_id: 157,
  feed_url: 'http://google.com',
  feed_type: 1,
  poster_display_name: 'poster_display_name',
  social_post_category_id: 1,
  poster_avatar_url: 'poster_avatar_url',
  socialPostCategory: {
    ...filledSocialPostCategory
  }
};

export const mockIntegration: IWallsIntegration = {
  id: 4,
  school_id: 157,
  feed_url: 'https://www.cbc.ca/cmlink/rss-topstorie',
  feed_type: 1,
  poster_display_name: '',
  social_post_category_id: 11,
  poster_avatar_url: '',
  sync_status: 1,
  last_successful_sync_epoch: 1541794599
};

export class MockWallsIntegrationsService {
  holder;

  getSocialPostCategories(params) {
    this.holder = { params };
    return of([]);
  }
  createSocialPostCategory(body, params) {
    this.holder = { body, params };

    return of({ mockIntegration });
  }
}
