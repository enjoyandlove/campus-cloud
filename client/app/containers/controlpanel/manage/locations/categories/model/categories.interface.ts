export interface ICategory {
  id?: number;

  name: string;

  img_url: string;

  is_default: boolean;

  category_type_id: number;

  category_type_name: string;
}

export interface ICategoryType {
  id?: number;

  name: string;
}
