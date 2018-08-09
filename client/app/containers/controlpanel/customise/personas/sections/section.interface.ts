import { ITile } from './../tiles/tile.interface';

export interface ICampusGuide {
  id?: number;
  name: string;
  rank: number;
  _disabled?: boolean;
  tiles?: Array<ITile>;
  _featureTile?: boolean;
  _categoryZero?: boolean;
}
