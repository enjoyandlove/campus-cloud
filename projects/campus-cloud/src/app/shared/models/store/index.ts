export enum StoreCategoryType {
  club = 0,
  athletics = 16,
  services = 19
}

export interface ICampusStore {
  id?: number;
  franchise_id: number;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  address: string;
  province: string;
  city: string;
  country: string;
  postal_code: string;
  category_id: number;
  likes: number;
  dislikes: number;
  description: string;
  website: string;
  email: string;
  location: string;
  room_info: string;
  has_hours: boolean;
  total_item_count: number;
  item_preview: string;
  secondary_name: string;
  logo_url: string;
}
