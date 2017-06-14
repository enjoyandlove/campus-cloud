export interface IEvent {
  store_id: number;
  title: string;
  start: number;
  end: number;
  poster_url: string;
  poster_thumb_url: string;
  description?: string;
  location?: string;
  room_data?: string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  event_attendance?: number;
  event_feedback?: number;
  event_manager_id?: number;
  attendance_manager_email?: string;
}
