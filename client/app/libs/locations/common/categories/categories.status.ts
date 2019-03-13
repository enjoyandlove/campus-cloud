const dbPath = 'https://d38h7mnlv8qddx.cloudfront.net/';

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

export const categoryIconType = {
  [dbPath + 'location_pin.png']: 'Pin',
  [dbPath + 'location_category_bus.png']: 'Bus',
  [dbPath + 'location_category_bike.png']: 'Bike',
  [dbPath + 'location_category_dining.png']: 'Food',
  [dbPath + 'location_category_library.png']: 'Book',
  [dbPath + 'location_category_health.png']: 'Health',
  [dbPath + 'location_category_security.png']: 'Badge',
  [dbPath + 'location_category_parking.png']: 'Parking',
  [dbPath + 'location_category_housing.png']: 'Building',
  [dbPath + 'location_category_information.png']: 'Information',
  [dbPath + 'location_category_accessability.png']: 'Accessibility',
};
