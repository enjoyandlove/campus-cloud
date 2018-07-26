import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { ITile } from './tile.interface';
import { TileFeatureRank, TileVisibility } from './tiles.status';
import { CPSession } from '../../../../../session';
import { IPersona } from '../persona.interface';

@Injectable()
export class TilesUtilsService {
  defaultTileCategoryIds = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13];

  constructor(public fb: FormBuilder, public session: CPSession) {}

  isTileDefault(tile: ITile) {
    return this.defaultTileCategoryIds.includes(tile.tile_category_id);
  }

  isCampaignTile(tile: ITile) {
    return tile.related_link_data.link_url === 'oohlala://school_campaign';
  }

  isFeatured(tile: ITile) {
    return tile.featured_rank !== -1;
  }

  isTileVisible(tile: ITile) {
    return tile.visibility_status === TileVisibility.visible;
  }

  getPersonaNameByLocale(persona: IPersona) {
    const name = persona.localized_name_map;

    return CPI18nService.getLocale().startsWith('fr') ? name.fr : name.en;
  }

  campusGuideTileForm(personaId, lastRank, tileCategoryId, guide = null) {
    const _guide = guide
      ? { ...guide }
      : {
          name: null,
          rank: lastRank,
          img_url: null,
          color: 'FFFFFF',
          extra_info: null,
          visibility_status: TileVisibility.visible,
          tile_category_id: tileCategoryId,
          featured_rank: TileFeatureRank.notFeatured
        };

    return this.fb.group({
      school_id: [this.session.g.get('school').id, Validators.required],
      school_persona_id: [personaId, Validators.required],
      name: [_guide.name, Validators.required],
      rank: [_guide.rank, Validators.required],
      img_url: [_guide.img_url, Validators.required],
      color: [_guide.color, Validators.required],
      extra_info: [_guide.extra_info],
      visibility_status: [_guide.visibility_status],
      tile_category_id: [_guide.tile_category_id, Validators.required],
      featured_rank: [_guide.featured_rank, Validators.required]
    });
  }

  campusLinkForm(nameRequired = true, imageRequired = true, link = null) {
    const _link = link
      ? { ...link }
      : {
          name: null,
          link_url: null,
          link_params: null,
          img_url: null,
          open_in_browser: 0,
          is_system: 1,
          school_id: this.session.g.get('school').id
        };

    return this.fb.group({
      name: [_link.name, nameRequired ? Validators.required : null],
      link_url: [_link.link_url, Validators.required],
      link_params: [_link.link_params, Validators.required],
      img_url: [_link.img_url, imageRequired ? Validators.required : null],
      open_in_browser: [_link.open_in_browser],
      is_system: [_link.is_system],
      school_id: [_link.school_id, Validators.required]
    });
  }
}
