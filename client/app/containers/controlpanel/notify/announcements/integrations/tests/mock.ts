import { mockSchool } from '@app/session/mock';
import { IAnnoucementsIntegration } from './../model';
import { IntegrationTypes } from '@libs/integrations/common/model';
import { AnnouncementPriority } from './../../announcements.interface';

export const emptyForm = {
  school_id: null,
  feed_url: null,
  feed_type: null,
  store_id: null,
  priority: null
};

export const filledForm = {
  school_id: mockSchool.id,
  feed_url: 'http://www.google.com',
  feed_type: IntegrationTypes.rss,
  store_id: 1,
  priority: AnnouncementPriority.regular
};

export const mockIntegration: IAnnoucementsIntegration = {
  id: 4,
  school_id: mockSchool.id,
  store_id: 28677,
  feed_url: 'https://www.cbc.ca/cmlink/rss-topstorie',
  feed_type: 1,
  priority: 1,
  sync_status: 1,
  last_successful_sync_epoch: 1541794599
};
