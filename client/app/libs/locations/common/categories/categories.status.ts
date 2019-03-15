export interface ICategoriesApiQuery {
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

export const isDefault = {
  true: 't_shared_yes',
  false: 't_shared_no'
};

export const categoryTypes = {
  2: 'Dining',
  1: 'Building',
  3: 'Location'
};

export enum LocationCategoryLocale {
  'eng' = 'en',
  'fr' = 'fr'
}
