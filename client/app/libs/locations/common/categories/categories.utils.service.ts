import { Injectable } from '@angular/core';

import { ICategory } from '@libs/locations/common/categories/model';
import { categoryTypes } from '@libs/locations/common/categories/categories.status';

const dbPath = 'https://d38h7mnlv8qddx.cloudfront.net/';

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
  [dbPath + 'location_category_accessability.png']: 'Accessibility'
};

@Injectable()
export class CategoriesUtilsService {
  getParsedCategoriesEventProperties(category: ICategory) {
    const icon_type = categoryIconType[category.img_url];
    const category_type = categoryTypes[category.category_type_id];

    return {
      icon_type,
      category_type,
      category_id: category.id
    };
  }
}
