import { FormBuilder, Validators } from '@angular/forms';

import { CPSession } from '@app/session';
import { getItem } from '@shared/components';
import { CPI18nService } from '@shared/services';
import { CustomValidators } from '@shared/validators';
import { environment } from '@client/environments/environment';
import { ICategory, ICategoryType } from './categories.interface';

export enum DeleteError {
  'locations_associated_to_category' = 't_error_category_associated_to_location'
}

const dbPath = 'https://d38h7mnlv8qddx.cloudfront.net/';
const assetPath = `${environment.root}public/svg/locations/categories/`;

export class CategoryModel {
  constructor(public session: CPSession) {}

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
      name: [_category.name, CustomValidators.requiredNonEmpty],
      category_type_id: [_category.category_type_id, Validators.required]
    });
  }

  static setCategoryTypes(categoryTypes: ICategoryType[]) {
    const cpI18n = new CPI18nService();
    const _heading = [
      {
        action: null,
        label: cpI18n.translate('t_locations_category_type_select')
      }
    ];

    const _categoryTypes = categoryTypes.map((types: ICategoryType) => {
      return getItem(types, 'name', 'id');
    });

    return [..._heading, ..._categoryTypes];
  }

  static diningCategoryIcons() {
    return [
      {
        icon: `${assetPath + 'dining.svg'}`,
        value: `${dbPath + 'location_category_dining.png'}`
      },
      {
        icon: `${assetPath + 'location_pin.svg'}`,
        value: `${dbPath + 'location_pin.png'}`
      }
    ];
  }

  static categoryIcons() {
    return [
      {
        icon: `${assetPath + 'location_pin.svg'}`,
        value: `${dbPath + 'location_pin.png'}`
      },
      {
        icon: `${assetPath + 'housing.svg'}`,
        value: `${dbPath + 'location_category_housing.png'}`
      },
      {
        icon: `${assetPath + 'library.svg'}`,
        value: `${dbPath + 'location_category_library.png'}`
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
      },
      {
        icon: `${assetPath + 'bus.svg'}`,
        value: `${dbPath + 'location_category_bus.png'}`
      },
      {
        icon: `${assetPath + 'bike.svg'}`,
        value: `${dbPath + 'location_category_bike.png'}`
      },
      {
        icon: `${assetPath + 'health.svg'}`,
        value: `${dbPath + 'location_category_health.png'}`
      },
      {
        icon: `${assetPath + 'information.svg'}`,
        value: `${dbPath + 'location_category_information.png'}`
      }
    ];
  }

  static categoryIconColors() {
    return [
      { code: 'E04141' },
      { code: 'FFA941' },
      { code: 'EC6634' },
      { code: '57BFCB' },
      { code: '5DCB87' },
      { code: '4F5A7A' },
      { code: 'FB6565' },
      { code: '4F5CF2' },
      { code: '0076FF' },
      { code: '9200AF' }
    ];
  }
}
