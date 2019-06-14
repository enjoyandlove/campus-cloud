import { FormBuilder, Validators } from '@angular/forms';
import { flatten, get as _get, sortBy } from 'lodash';
import { Injectable } from '@angular/core';

import { IPersona } from './persona.interface';
import { ITile } from './tiles/tile.interface';
import { CPSession } from './../../../../session';
import { TileCategoryRank } from './tiles/tiles.status';
import { CPDate } from './../../../../shared/utils/date/date';
import { TilesUtilsService } from './tiles/tiles.utils.service';
import { PersonasLoginRequired, PersonasType } from './personas.status';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../shared/services/i18n.service';
import { ResourcesUtilsService } from './tiles/resources/resources.utils.service';

@Injectable()
export class PersonasUtilsService {
  static localizedPersonaName(persona: IPersona) {
    const locale = CPI18nService.getLocale().startsWith('fr') ? 'fr' : 'en';

    return persona.localized_name_map[locale];
  }

  static isWeb(type: PersonasType) {
    return type === PersonasType.web;
  }

  static isLoginRequired(loginRequirement: PersonasLoginRequired) {
    return loginRequirement === PersonasLoginRequired.forbidden;
  }

  constructor(
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public tileUtils: TilesUtilsService,
    public resourceUtils: ResourcesUtilsService
  ) {}

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
      .filter((tile: ITile) => tile.rank !== -1)
      .filter((tile: ITile) => tile.featured_rank === -1);
  }

  getFeaturedTiles(tiles: ITile[]) {
    const featureTiles = tiles.filter(
      (tile: ITile) =>
        tile.featured_rank > -1 &&
        tile.related_link_data.link_url !== 'oohlala://campus_security_service'
    );

    return sortBy(flatten(featureTiles), (i) => i.featured_rank);
  }

  getCampusSecurityServiceId(campusSecurity) {
    return _get(campusSecurity, ['related_link_data', 'link_params', 'id'], null);
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

  getPersonasForm(persona: IPersona = null) {
    const _persona = {
      school_id: this.session.g.get('school').id,
      name: persona ? persona.localized_name_map.en : null,
      platform: persona ? persona.platform : PersonasType.mobile,
      rank: persona ? persona.rank : CPDate.now(this.session.tz).unix(),
      login_requirement: persona ? persona.login_requirement : PersonasLoginRequired.optional,
      pretour_enabled: persona ? persona.pretour_enabled : false,
      cre_enabled: persona ? persona.cre_enabled : false,
      clone_tiles: false
    };

    return this.fb.group({
      school_id: [_persona.school_id, Validators.required],
      name: [_persona.name, [Validators.required, Validators.maxLength(255)]],
      platform: [_persona.platform, Validators.required],
      rank: [_persona.rank, Validators.required],
      login_requirement: [_persona.login_requirement],
      pretour_enabled: [_persona.pretour_enabled],
      cre_enabled: [_persona.cre_enabled],
      clone_tiles: [_persona.clone_tiles]
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
      rank: [TileCategoryRank.hidden, Validators.required]
    });
  }

  plaftormMenu() {
    return [
      {
        id: PersonasType.mobile,
        label: this.cpI18n.translate('t_personas_platform_mobile')
      },
      {
        id: PersonasType.web,
        label: this.cpI18n.translate('t_personas_platform_web')
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

  getTileAmplitudeProperties(tile: ITile) {
    const status = this.tileUtils.isTileVisible(tile)
      ? amplitudeEvents.SHOWN
      : amplitudeEvents.HIDDEN;

    const tile_type = this.tileUtils.isFeatured(tile)
      ? amplitudeEvents.FEATURED
      : amplitudeEvents.NORMAL;

    const content_type = this.resourceUtils.isListOfLists(tile.related_link_data)
      ? amplitudeEvents.RESOURCE_LIST
      : amplitudeEvents.RESOURCE;

    return {
      status,
      tile_type,
      content_type,
      tile_id: tile.id
    };
  }
}
