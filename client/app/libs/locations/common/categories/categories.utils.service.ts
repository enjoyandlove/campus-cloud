import { Injectable } from '@angular/core';

import {
  ICategory,
  categoryTypes,
  categoryIconType
} from '@libs/locations/common/categories/model';

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
