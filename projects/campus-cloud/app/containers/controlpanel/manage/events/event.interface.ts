export default interface IEvent {
  id?: number;

  encrypted_id?: string;

  store_id: number;

  title: string;

  description?: string;

  poster_thumb_url: string;

  poster_url: string;

  start: number;

  end: number;

  has_checkout: boolean;

  room_data?: string;

  location?: string;

  latitude?: number;

  longitude?: number;

  likes?: number;

  dislikes?: number;

  attends?: number;

  checkins?: number;

  verified_checkins?: number;

  avg_rating_percent?: number;

  rating_scale_maximum?: number;

  num_ratings?: number;

  related_feedback_obj_id?: number;

  attend_verification_methods?: number[];

  address?: string;

  city?: string;

  province?: string;

  country?: string;

  postal_code?: string;

  store_category: number;

  event_attendance?: number;

  event_feedback?: number;

  event_manager_id?: number;

  custom_basic_feedback_label?: string;

  attendance_manager_email?: string;

  qr_img_url?: string;

  is_external?: boolean;

  integration_feed_id?: number;
}
