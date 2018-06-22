import { Injectable } from '@angular/core';
import { ITile } from './../persona.interface';
import { TileVisibility } from './tiles.status';

@Injectable()
export class TilesUtilsService {
  defaultTileCategoryIds = [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13];

  isTileDefault(tile: ITile) {
    return this.defaultTileCategoryIds.includes(tile.tile_category_id);
  }

  isTileVisible(tile: ITile) {
    return tile.visibility_status === TileVisibility.visible;
  }
}
