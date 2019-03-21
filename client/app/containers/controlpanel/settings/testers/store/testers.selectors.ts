import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as reducer from './testers.reducers';
import { SETTINGS_TESTERS } from '@shared/constants';
import { ITestersFeature, ITestersState } from './testers.state';

const getTesterFeature = createFeatureSelector<ITestersFeature>(SETTINGS_TESTERS);

export const getTestersState = createSelector(getTesterFeature, (feature: ITestersFeature) => {
  return feature[SETTINGS_TESTERS];
});

export const getTesters = createSelector(getTestersState, reducer.getTesters);
export const getTestersSearch = createSelector(
  getTestersState,
  (state: ITestersState) => state.searchStr
);
export const getTestersLoading = createSelector(
  getTestersState,
  (state: ITestersState) => state.loading
);
export const getSortDirection = createSelector(
  getTestersState,
  (state: ITestersState) => state.sortDirection
);
