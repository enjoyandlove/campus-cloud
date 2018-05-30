import { Injectable } from '@angular/core';

import { CPI18nService } from './../../../../shared/services/i18n.service';
import { PersonasType, PersonasLoginRequired } from './personas.status';

@Injectable()
export class PersonasUtilsService {
  defaultTileCategoryIds = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13];

  constructor(public cpI18n: CPI18nService) {}

  requiresCredentialsMenu() {
    return [
      {
        id: PersonasLoginRequired.optional,
        label: this.cpI18n.translate('t_personas_form_dropdown_login_optional')
      },
      {
        id: PersonasLoginRequired.required,
        label: this.cpI18n.translate('t_personas_form_dropdown_login_required')
      },
      {
        id: PersonasLoginRequired.forbidden,
        label: this.cpI18n.translate('t_personas_form_dropdown_login_forbidden')
      }
    ];
  }

  filterTileByCategory(tiles, categoryId) {
    return tiles.filter((tile) => tile.tile_category_id === categoryId);
  }

  groupTilesWithTileCategories(tileCategories, tiles) {
    return tileCategories.map((category) => {
      return {
        ...category,
        tiles: this.filterTileByCategory(tiles, category.id)
      };
    });
  }

  plaftormMenu() {
    return [
      {
        id: PersonasType.mobile,
        label: this.cpI18n.translate('t_personas_form_dropdown_platform_mobile')
      },
      {
        id: PersonasType.web,
        label: this.cpI18n.translate('t_personas_form_dropdown_platform_web')
      }
    ];
  }

  parseLocalFormToApi(data) {
    data = {
      ...data,
      localized_name_map: {
        en: data.name,
        fr: data.name
      }
    };

    delete data['name'];

    return data;
  }
}
