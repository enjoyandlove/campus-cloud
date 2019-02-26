import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITestersState } from './testers.state';
import { SETTINGS_TESTERS } from '../testers.module';
import * as reducer from './testers.reducers';

const getTestersState = createFeatureSelector<ITestersState>(SETTINGS_TESTERS);

export const getTesters = createSelector(getTestersState, reducer.getTesters);
export const getTestersLoaded = createSelector(
  getTestersState,
  (state: ITestersState) => state.loaded
);
export const getTestersLoading = createSelector(
  getTestersState,
  (state: ITestersState) => state.loading
);
