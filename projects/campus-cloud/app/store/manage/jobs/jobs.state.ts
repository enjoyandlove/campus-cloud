import { IItem } from '@campus-cloud/app/shared/components';

export interface IJobsState {
  employers: IItem[];
  loaded: boolean;
  loading: boolean;
}
