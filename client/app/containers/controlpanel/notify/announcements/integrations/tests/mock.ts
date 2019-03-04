import { mockSchool } from '@app/session/mock';
import { IAnnoucementsIntegration } from './../model';

export const emptyForm = {
  school_id: mockSchool.id,
  feed_obj_id: null,
  feed_url: null,
  feed_type: 1,
  poster_url: null,
  poster_thumb_url: null,
  sync_status: 0,
  last_successful_sync_epoch: null
};

export const filledForm = {
  school_id: mockSchool.id,
  feed_obj_id: 1,
  feed_url: 'http://some.data',
  feed_type: 1,
  poster_url: null,
  poster_thumb_url: null,
  sync_status: 1
};

export const mockIntegration: IAnnoucementsIntegration = {
  id: 4,
  school_id: mockSchool.id,
  feed_obj_id: 28677,
  feed_url: 'https://www.cbc.ca/cmlink/rss-topstorie',
  feed_type: 1,
  poster_url: '',
  poster_thumb_url: '',
  sync_status: 1,
  last_successful_sync_epoch: 1541794599
};
