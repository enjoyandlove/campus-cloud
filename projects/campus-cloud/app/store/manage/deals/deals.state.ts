import { IItem } from '@campus-cloud/app/shared/components';

export interface IDealsState {
  stores: IItem[];
  loaded: boolean;
  loading: boolean;
}
