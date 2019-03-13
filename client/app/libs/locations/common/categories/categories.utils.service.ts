import { Injectable } from '@angular/core';

import { amplitudeEvents } from '@shared/constants';
import { CPTrackingService } from '@shared/services';
import { ICategory } from '@libs/locations/common/categories/model';
import { categoryIconType, categoryTypes } from '@libs/locations/common/categories/categories.status';

@Injectable()
export class CategoriesUtilsService {
  constructor(public cpTracking: CPTrackingService) {}

  getCategoriesAmplitudeProperties(isLocation?: boolean) {
    const page_type = isLocation
      ? amplitudeEvents.LOCATION_CATEGORY
      : amplitudeEvents.DINING_CATEGORY;

    return {
      ...this.cpTracking.getEventProperties(),
      page_type
    };
  }

  getParsedCategoriesEventProperties(category: ICategory, isLocation?: boolean) {
    const icon_type = categoryIconType[category.img_url];
    const category_type = categoryTypes[category.category_type_id];
    const page_type = isLocation ? amplitudeEvents.LOCATION_CATEGORY : amplitudeEvents.DINING_CATEGORY;

    return {
      icon_type,
      page_type,
      category_type,
      category_id: category.id
    };
  }
}
