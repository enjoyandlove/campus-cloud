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

  campusGuideTileForm(personaId, lastRank, tileCategoryId) {
    return this.fb.group({
      school_id: [this.session.g.get('school').id, Validators.required],
      school_persona_id: [personaId, Validators.required],
      name: [null, Validators.required],
      rank: [lastRank, Validators.required],
      img_url: [null, Validators.required],
      color: ['FFFFFF', Validators.required],
      extra_info: [null],
      visibility_status: [TileVisibility.visible],
      tile_category_id: [tileCategoryId, Validators.required],
      featured_rank: [TileFeatureRank.notFeatured, Validators.required]
    });
  }

  campusLinkForm(nameRequired = true, imageRequired = true) {
    return this.fb.group({
      name: [null, nameRequired ? Validators.required : null],
      link_url: [null, Validators.required],
      link_params: [null],
      img_url: [null, imageRequired ? Validators.required : null],
      open_in_browser: [0],
      is_system: [1],
      school_id: [this.session.g.get('school').id, Validators.required]
    });
  }
}
