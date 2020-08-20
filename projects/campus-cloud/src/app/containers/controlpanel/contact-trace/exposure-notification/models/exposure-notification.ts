import {
  ExposureNotificationListDetail,
  ExposureNotificationStatus,
  ExposureNotificationUserDetail
} from '.';

export interface ExposureNotification {
  id?: number;
  type?: number;
  is_external?: boolean;
  source?: number;
  store_id?: number;
  sent_time?: number;
  subject?: string;
  message?: string;
  priority?: number;
  notify_at_epoch?: number;
  is_school_wide?: boolean;
  store_name?: string;
  status?: ExposureNotificationStatus;
  user_details?: ExposureNotificationUserDetail[];
  list_details?: ExposureNotificationListDetail[];
}
