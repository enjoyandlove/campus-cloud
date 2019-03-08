export interface ICategoriesApiQuery {
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

export const isDefault = {
  true: 't_shared_yes',
  false: 't_shared_no'
};

export enum LocationCategoryLocale {
  'eng' = 'en',
  'fr' = 'fr'
}
