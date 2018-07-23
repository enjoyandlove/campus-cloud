import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { flatten, sortBy, get as _get } from 'lodash';
import { CPSession } from './../../../../session/index';
import { CPI18nService } from './../../../../shared/services/i18n.service';
import { PersonasLoginRequired, PersonasType } from './personas.status';
import { ICampusGuide } from './sections/section.interface';
import { ITile } from './tiles/tile.interface';

@Injectable()
export class PersonasUtilsService {
  constructor(public cpI18n: CPI18nService, public fb: FormBuilder, public session: CPSession) {}

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

  getCampusSecurityServiceId(campusSecurity) {
    return _get(campusSecurity, ['related_link_data', 'link_params', 'id'], null);
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

  getCampusLinkForm() {
    return this.fb.group({
      description: [null],
      img_url: [null],
      is_system: [1],
      link_params: this.fb.group({
        id: [null, Validators.required]
      }),
      link_url: ['oohlala://campus_security_service', Validators.required],
      name: [null, Validators.required],
      open_in_browser: [0],
      school_id: [this.session.g.get('school').id, Validators.required]
    });
  }

  getGuideTileForm() {
    return this.fb.group({
      color: ['FFFFFF'],
      description: [null],
      extra_info: this.fb.group({
        id: [null, Validators.required]
      }),
      featured_rank: [0],
      img_url: [null, Validators.required],
      school_id: [this.session.g.get('school').id, Validators.required],
      school_persona_id: [null, Validators.required],
      tile_category_id: [0, Validators.required],
      visibility_status: [1, Validators.required],
      name: [null, Validators.required],
      rank: [-1, Validators.required]
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

  mergeRelatedLinkData(tilesByPersonaId: ITile[], tilesByPersonaZero: ITile[]) {
    return tilesByPersonaId.map((tile: ITile) => {
      return {
        ...tile,
        related_link_data: tilesByPersonaZero
          .filter((t: ITile) => t.id === tile.extra_info.id)
          .map((t: ITile) => t.related_link_data)[0]
      };
    });
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
