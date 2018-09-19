import { ITile, ITileBulk } from './../tiles/tile.interface';

export interface ICampusGuide {
  id?: number;
  name: string;
  rank: number;
  _disabled?: boolean;
  tiles?: ITile[];
  _featureTile?: boolean;
  _categoryZero?: boolean;
}

export interface ICampusGuideBulk {
  id?: number;
  name: string;
  rank: number;
  _disabled?: boolean;
  tiles?: ITileBulk[];
  _featureTile?: boolean;
  _categoryZero?: boolean;
}
