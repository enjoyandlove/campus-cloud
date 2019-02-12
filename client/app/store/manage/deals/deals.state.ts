import { IItem } from '@client/app/shared/components';

export interface IDealsState {
  stores: IItem[];
  loaded: boolean;
  loading: boolean;
}
