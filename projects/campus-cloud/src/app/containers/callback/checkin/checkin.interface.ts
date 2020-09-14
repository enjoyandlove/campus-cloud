import IAttendee from './components/attendee.interface';

export default interface ICheckIn {
  color: number;

  id: number;

  rank: number;

  end: number;

  type: number;

  title: string;

  start: number;

  ref_id: number;

  status: number;

  user_id: number;

  location: string;

  extra_id: number;

  latitude: number;

  longitude: number;

  extra_str: string;

  qr_img_url: string;

  poster_url: string;

  alert_time: number;

  is_all_day: boolean;

  has_invite: boolean;

  school_name: string;

  description: string;

  calendar_id: number;

  extra_status: number;

  has_gallery: boolean;

  is_recurring: boolean;

  has_checkout: boolean;

  qr_img_base64: string;

  extra_data_id: number;

  last_edit_time: number;

  attendees: IAttendee[];

  tz_zoneinfo_str: string;

  poster_thumb_url: string;

  event_identifier: string;

  app_logo_img_url: string;

  featured_image_url: string;

  app_logo_img_base64: string;

  rating_scale_maximum: number;

  custom_basic_feedback_label: string;

  attend_verification_methods: number[];

  checkin_verification_methods?: number[];

  deep_link_url: string;
}
