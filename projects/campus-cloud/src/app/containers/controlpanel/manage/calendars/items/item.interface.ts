export interface IItem {
  id?: number;
  title: string;
  location: string;
  is_all_day: number;
  description: string;
  start: number;
  end: number;
  latitude: number;
  longitude: number;
  date_created: number;
  last_edit_time: number;
  postal_code: string;
}

export enum ItemAllDay {
  false = 0,
  true = 1
}
