export interface ICategory {
  id?: number;

  name: string;

  color: string;

  img_url: string;

  is_default: boolean;

  locations_count: number;

  category_type_id: number;

  category_type_name: string;
}

export interface ICategoryType {
  id?: number;

  name: string;
}
