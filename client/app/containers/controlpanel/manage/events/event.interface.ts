export default interface IEvent {
  id?: Number;

  encrypted_id?: String;

  store_id: Number;

  title: String;

  description?: String;

  poster_thumb_url: String;

  poster_url: String;

  start: Number;

  end: Number;

  has_checkout: boolean;

  room_data?: String;

  location?: String;

  latitude?: Number;

  longitude?: Number;

  likes?: Number;

  dislikes?: Number;

  attends?: Number;

  checkins?: Number;

  verified_checkins?: Number;

  avg_rating_percent?: Number;

  rating_scale_maximum?: Number;

  num_ratings?: Number;

  related_feedback_obj_id?: Number;

  attend_verification_methods?: Number[];

  address?: String;

  city?: String;

  province?: String;

  country?: String;

  postal_code?: String;

  event_attendance?: Number;

  event_feedback?: Number;

  event_manager_id?: Number;

  custom_basic_feedback_label?: String;

  attendance_manager_email?: String;

  qr_img_url?: String;
}
