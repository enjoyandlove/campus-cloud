import { ILinks, ISchedule } from './schedule.interface';

export interface ILocation {
  id?: number;

  city: string;

  name: string;

  phone: number;

  email: string;

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

  links: ILinks[];

  schedule: ISchedule[];
}
