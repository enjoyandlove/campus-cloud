import { IItem } from '@campus-cloud/shared/components';

export interface IDealsState {
  stores: IItem[];
  loaded: boolean;
  loading: boolean;
}
