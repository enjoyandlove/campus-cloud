import { IItem } from '@client/app/shared/components';

export interface IJobsState {
  employers: IItem[];
  loaded: boolean;
  loading: boolean;
}
