export interface ExposureNotification {
  id?: number;
  is_external: boolean;
  source: number;
  store_id: number;
  sent_time: number;
  subject: string;
  message: string;
  priority: number;
  notify_at_epoch: number;
  is_school_wide: boolean;
  store_name: string;
  // status: AnnouncementStatus;
  // user_details: IUserDetail[];
  // list_details: IListDetail[];
}
