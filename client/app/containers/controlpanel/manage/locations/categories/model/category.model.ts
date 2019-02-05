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
      color: category ? category.color : null,
      img_url: category ? category.img_url : null,
      category_type_id: category ? category.category_type_id : null
    };

    return fb.group({
      color: [_category.color, Validators.required],
      img_url: [_category.img_url, Validators.required],
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
    const dbPath = 'https://d38h7mnlv8qddx.cloudfront.net/';
    const assetPath = `${environment.root}public/svg/categories/`;

    return [
      {
        value: `${dbPath + 'location_pin.png'}`,
        icon: `${assetPath + 'location_pin.svg'}`
      },
      {
        icon: `${assetPath + 'dining.svg'}`,
        value: `${dbPath + 'location_category_dining.png'}`
      },
      {
        icon: `${assetPath + 'housing.svg'}`,
        value: `${dbPath + 'location_category_housing.png'}`
      },
      {
        icon: `${assetPath + 'library.svg'}`,
        value: `${dbPath + 'location_category_library.png'}`,
      },
      {
        icon: `${assetPath + 'parking.svg'}`,
        value: `${dbPath + 'location_category_parking.png'}`
      },
      {
        icon: `${assetPath + 'security.svg'}`,
        value: `${dbPath + 'location_category_security.png'}`
      },
      {
        icon: `${assetPath + 'accessability.svg'}`,
        value: `${dbPath + 'location_category_accessability.png'}`
      }
    ];
  }

  static categoryIconColors() {
    return [
      { code: 'CF0000' },
      { code: 'FF5A1B' },
      { code: 'FFA416' },
      { code: '00C2CD' },
      { code: '00CE80' },
      { code: '4C5A7D' },
      { code: 'FF575F' },
      { code: '4B5DFB' },
      { code: '0076FF' }
    ];
  }
}
