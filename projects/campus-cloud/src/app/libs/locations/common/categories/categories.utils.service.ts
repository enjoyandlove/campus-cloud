import { Injectable } from '@angular/core';

import {
  ICategory,
  categoryTypesMap,
  categoryIconType
} from '@campus-cloud/libs/locations/common/categories/model';

@Injectable()
export class CategoriesUtilsService {
  getParsedCategoriesEventProperties(category: ICategory) {
    const icon_type = categoryIconType[category.img_url];
    const category_type = categoryTypesMap[category.category_type_id];

    return {
      icon_type,
      category_type,
      category_id: category.id
    };
  }
}
