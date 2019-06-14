import { IItem } from '@campus-cloud//shared/components';

export interface IJobsState {
  employers: IItem[];
  loaded: boolean;
  loading: boolean;
}
