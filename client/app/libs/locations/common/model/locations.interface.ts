import { ILinks, ISchedule } from './schedule.interface';

export interface ILocationTiming {
  value: number;

  label: string;
}

export interface ILocation {
  id?: number;

  city: string;

  name: string;

  phone: number;

  email: string;

  notes?: string;

  links: ILinks[];

  country: string;

  address: string;

  province: string;

  latitude: number;

  longitude: number;

  image_url: string;

  short_name: string;

  description: string;

  postal_code: string;

  category_id: number;

  schedule: ISchedule[];

  category_name: string;

  category_color: string;

  category_img_url: string;
}
