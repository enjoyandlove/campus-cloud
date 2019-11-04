export interface IAnnouncement {
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
  status: AnnouncementStatus;
  user_details: IUserDetail[];
  list_details: IListDetail[];
}

export interface IListDetail {
  id: number;
  name: string;
}

export interface IUserDetail {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
}

export enum AnnouncementStatus {
  error = -1,
  pending = 0,
  success = 1,
  processing = 2
}

export enum AnnouncementPriority {
  urgent = 1,
  regular = 2,
  emergency = 0
}
