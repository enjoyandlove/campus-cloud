export interface IClub {
  id?: number;

  name: string;

  secondary_name?: string;

  description?: string;

  category_id: number;

  franchise_id: number;

  latitude: number;

  longitude: number;

  logo_url: string;

  item_preview?: string;

  status: number;

  has_membership: boolean;

  member_count: number;

  group_id: number;

  room_info: string;

  location: string;

  address?: string;

  city?: string;

  province?: string;

  country?: string;

  postal_code?: string;

  phone?: string;

  website?: string;

  email?: string;

  has_hours?: boolean;

  store_hours?: any;

  likes?: number;

  dislikes?: number;

  advisor_firstname?: string;

  advisor_lastname?: string;

  advisor_email?: string;

  constitution_url?: string;
}

