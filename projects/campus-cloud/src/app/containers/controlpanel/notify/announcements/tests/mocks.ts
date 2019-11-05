import { IAnnouncement } from './../model';

export const mockAnnouncement: IAnnouncement = {
  is_external: false,
  source: 1,
  store_id: 1,
  sent_time: 1,
  subject: 'Mock Subject',
  message: 'Mock Message',
  priority: 1,
  status: 1,
  notify_at_epoch: 1,
  is_school_wide: false,
  store_name: 'Mock Store Name',
  user_details: [],
  list_details: []
};
