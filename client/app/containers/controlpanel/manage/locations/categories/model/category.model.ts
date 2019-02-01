import { FormBuilder, Validators } from '@angular/forms';

import { getItem } from '@shared/components';
import { CPI18nService } from '@shared/services';
import { CustomTextValidators } from '@shared/validators';
import { environment } from '@client/environments/environment';
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

  static categoryIcons() {
    const path = `${environment.root}public/png/locations-category/`;

    return [
      { icon: path + 'dining.png' },
      { icon: path + 'housing.png' },
      { icon: path + 'library.png' },
      { icon: path + 'parking.png' },
      { icon: path + 'security.png' },
      { icon: path + 'location_pin.png' },
      { icon: path + 'accessability.png' }
    ];
  }

  static categoryIconsColors() {
    return [
      { code: '#CF0000' },
      { code: '#FF5A1B' },
      { code: '#FFA416' },
      { code: '#00C2CD' },
      { code: '#00CE80' },
      { code: '#4C5A7D' },
      { code: '#FF575F' },
      { code: '#4B5DFB' },
      { code: '#0076FF' }
    ];
  }
}
