import { ITile, ITileBulk } from './../tiles/tile.interface';

export interface ICampusGuide {
  id?: number;
  name: string;
  rank: number;
  tiles?: ITile[];
  _temporary?: boolean;
  _disabled?: boolean;
  _featuredTile?: boolean;
}

export interface ICampusGuideBulk {
  id?: number;
  name: string;
  rank: number;
  tiles?: ITileBulk[];
  _temporary?: boolean;
  _disabled?: boolean;
  _featuredTile?: boolean;
}
