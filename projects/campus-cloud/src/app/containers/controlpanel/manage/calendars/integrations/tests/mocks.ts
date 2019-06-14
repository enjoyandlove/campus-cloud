import { IEventIntegration } from '@campus-cloud/src/app/libs/integrations/events/model';

export const emptyForm = {
  school_id: 157,
  feed_url: null,
  feed_type: 1,
  feed_obj_id: null,
  sync_status: 0,
  last_successful_sync_epoch: null
};

export const filledForm = {
  school_id: 157,
  feed_obj_id: 1,
  feed_url: 'http://some.data',
  feed_type: 1,
  sync_status: 1
};

export const mockIntegration: IEventIntegration = {
  id: 4,
  school_id: 157,
  feed_obj_id: 1,
  feed_url: 'https://www.cbc.ca/cmlink/rss-topstorie',
  feed_type: 1,
  sync_status: 1,
  last_successful_sync_epoch: 1541794599
};

export class MockActivatedRoute {
  snapshot = {
    params: {
      calendarId: 1
    }
  };
}
