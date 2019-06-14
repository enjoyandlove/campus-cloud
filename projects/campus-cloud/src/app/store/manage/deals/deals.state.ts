import { IItem } from '@campus-cloud/src/app/shared/components';

export interface IDealsState {
  stores: IItem[];
  loaded: boolean;
  loading: boolean;
}
