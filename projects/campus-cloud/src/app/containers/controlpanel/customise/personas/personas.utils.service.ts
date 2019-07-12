import { FormBuilder, Validators } from '@angular/forms';
import { flatten, get as _get, sortBy } from 'lodash';
import { Injectable } from '@angular/core';

import { IPersona } from './persona.interface';
import { ITile } from './tiles/tile.interface';
import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { TileCategoryRank } from './tiles/tiles.status';
import { CPI18nService } from '@campus-cloud/shared/services';
import { TilesUtilsService } from './tiles/tiles.utils.service';
import { CPDropdownComponent } from '@campus-cloud/shared/components';
import { PersonasLoginRequired, PersonasType } from './personas.status';
import { ResourcesUtilsService } from './tiles/resources/resources.utils.service';

@Injectable()
export class PersonasUtilsService {
  static isWeb(type: PersonasType) {
    return type === PersonasType.web;
  }

  static isLoginForbidden(loginRequirement: PersonasLoginRequired) {
    return loginRequirement === PersonasLoginRequired.forbidden;
  }

  static getHomeExperience() {
    return [
      {
        id: 'schedule',
        name: 'home_todays_schedule_enabled',
        heading: 't_personas_form_heading_todays_schedule',
        subHeading: 't_personas_form_sub_heading_todays_schedule'
      },
      {
        id: 'courses',
        name: 'home_my_courses_enabled',
        heading: 't_personas_form_heading_my_courses',
        subHeading: 't_personas_form_sub_heading_my_courses'
      },
      {
        id: 'dates',
        name: 'home_due_dates_enabled',
        heading: 't_personas_form_heading_upcoming_deadlines',
        subHeading: 't_personas_form_sub_heading_upcoming_deadlines'
      }
    ];
  }

  static setPersonaDropDown(personas) {
    const _heading = [CPDropdownComponent.defaultPlaceHolder()];

    const _persona = personas.map((persona: IPersona) => {
      return {
        label: CPI18nService.getLocalizedLabel(persona.localized_name_map),
        action: persona.id
      };
    });

    return [..._heading, ..._persona];
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
      clone_tiles: false,
      school_id: this.session.g.get('school').id,
      cre_enabled: persona ? persona.cre_enabled : false,
      name: persona ? persona.localized_name_map.en : null,
      platform: persona ? persona.platform : PersonasType.mobile,
      pretour_enabled: persona ? persona.pretour_enabled : false,
      rank: persona ? persona.rank : CPDate.now(this.session.tz).unix(),
      home_due_dates_enabled: persona ? persona.home_due_dates_enabled : true,
      home_my_courses_enabled: persona ? persona.home_my_courses_enabled : true,
      home_todays_schedule_enabled: persona ? persona.home_todays_schedule_enabled : true,
      login_requirement: persona ? persona.login_requirement : PersonasLoginRequired.optional
    };

    return this.fb.group({
      school_id: [_persona.school_id, Validators.required],
      name: [_persona.name, [Validators.required, Validators.maxLength(255)]],
      platform: [_persona.platform, Validators.required],
      rank: [_persona.rank, Validators.required],
      login_requirement: [_persona.login_requirement],
      pretour_enabled: [_persona.pretour_enabled],
      cre_enabled: [_persona.cre_enabled],
      clone_tiles: [_persona.clone_tiles],
      home_due_dates_enabled: [_persona.home_due_dates_enabled],
      home_my_courses_enabled: [_persona.home_my_courses_enabled],
      home_todays_schedule_enabled: [_persona.home_todays_schedule_enabled]
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
}
