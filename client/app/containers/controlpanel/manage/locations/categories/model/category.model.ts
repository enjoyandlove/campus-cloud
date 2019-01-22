import { FormBuilder, Validators } from '@angular/forms';

import { getItem } from '@shared/components';
import { CPI18nService } from '@shared/services';
import { CustomTextValidators } from '@shared/validators';
import { ICategory, ICategoryType } from './categories.interface';

export enum DeleteError {
  'locations_associated_to_category' = 't_error_category_associated_to_location'
}

export class CategoryModel {
  static form(category?: ICategory) {
    const fb = new FormBuilder();

    const _category = {
      name: category ? category.name : null,
      img_url: category ? category.img_url : null,
      category_type_id: category ? category.category_type_id : null
    };

    return fb.group({
      img_url: [_category.img_url],
      name: [_category.name, CustomTextValidators.requiredNonEmpty],
      category_type_id: [_category.category_type_id, Validators.required]
    });
  }

  static setCategoryTypes(categoryTypes: ICategoryType[]) {
    const cpI18n = new CPI18nService();
    const _heading = [{
      action: null,
      label: cpI18n.translate('t_locations_category_type_select')
    }];

    const _categoryTypes = categoryTypes.map((types: ICategoryType) => {
      return getItem(types, 'name', 'id');
    });

    return [..._heading, ..._categoryTypes];
  }
}
