import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ITile } from './../persona.interface';
import { TileFeatureRank, TileVisibility } from './tiles.status';
import { CPSession } from '../../../../../session';

@Injectable()
export class TilesUtilsService {
  defaultTileCategoryIds = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13];

  constructor(public fb: FormBuilder, public session: CPSession) {}

  isTileDefault(tile: ITile) {
    return this.defaultTileCategoryIds.includes(tile.tile_category_id);
  }

  isTileVisible(tile: ITile) {
    return tile.visibility_status === TileVisibility.visible;
  }

  campusGuideTileForm(personaId, lastRank, tileCategoryId) {
    return this.fb.group({
      school_id: [this.session.g.get('school').id, Validators.required],
      school_persona_id: [personaId, Validators.required],
      name: [null, Validators.required],
      rank: [lastRank, Validators.required],
      img_url: [null, Validators.required],
      color: [null, Validators.required],
      extra_info: [null],
      visibility_status: [TileVisibility.visible],
      tile_category_id: [tileCategoryId, Validators.required],
      featured_rank: [TileFeatureRank.notFeatured, Validators.required]
    });
  }

  campusLinkForm() {
    return this.fb.group({
      name: [null, Validators.required],
      link_url: [null, Validators.required],
      link_params: [null],
      img_url: [null],
      open_in_browser: [null],
      is_system: [null],
      school_id: [this.session.g.get('school').id, Validators.required]
    });
  }
}
