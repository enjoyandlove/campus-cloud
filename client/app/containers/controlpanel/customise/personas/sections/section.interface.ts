import { ITile } from './../tiles/tile.interface';

export interface ICampusGuide {
  id?: number;
  name: string;
  rank: number;
  tiles?: Array<ITile>;
}
