import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IJobsState } from './jobs';
import { IDealsState } from './deals';
import { IManageState } from './manage-store.module';

export const getManageState = createFeatureSelector<IManageState>('manage');

// deals
export const getDealsState = createSelector(
  getManageState,
  (state: IManageState) => state.deals
);
export const getDealsStores = createSelector(
  getDealsState,
  (state: IDealsState) => state.stores
);
export const getDealsLoaded = createSelector(
  getDealsState,
  (state: IDealsState) => state.loaded
);
export const getDealsLoading = createSelector(
  getDealsState,
  (state: IDealsState) => state.loading
);

// jobs
export const getJobsState = createSelector(
  getManageState,
  (state: IManageState) => state.jobs
);
export const getJobsEmployers = createSelector(
  getJobsState,
  (state: IJobsState) => state.employers
);
export const getJobsEmployersLoaded = createSelector(
  getJobsState,
  (state: IJobsState) => state.loaded
);
export const getJobsEmployersLoading = createSelector(
  getJobsState,
  (state: IJobsState) => state.loading
);
