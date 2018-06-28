import { Injectable } from '@angular/core';
import { flatten, sortBy } from 'lodash';
import { CPI18nService } from './../../../../shared/services/i18n.service';
import { PersonasLoginRequired, PersonasType } from './personas.status';
import { ICampusGuide } from './sections/section.interface';
import { ITile } from './tiles/tile.interface';

@Injectable()
export class PersonasUtilsService {
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
    return tiles
      .filter((tile: ITile) => tile.tile_category_id === categoryId)
      .filter((tile: ITile) => tile.rank !== -1);
  }

  getCategoryZeroTiles(guides: Array<ICampusGuide>) {
    return sortBy(
      flatten(
        guides.map((guide: ICampusGuide) =>
          guide.tiles.filter((tile: ITile) => tile.tile_category_id === 0)
        )
      ),
      (i) => i.rank
    );
  }

  getFeaturedTiles(guides: Array<ICampusGuide>) {
    return sortBy(
      flatten(
        guides.map((guide: ICampusGuide) =>
          guide.tiles.filter((tile: ITile) => tile.featured_rank > -1)
        )
      ),
      (i) => i.rank
    );
  }

  filterTiles(guides: Array<ICampusGuide>) {
    return guides.map((guide: ICampusGuide) => {
      return {
        ...guide,
        tiles: guide.tiles
          .filter((tile: ITile) => tile.tile_category_id !== 0)
          .filter((tile: ITile) => tile.rank > -1)
      };
    });
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
