import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardState } from '../reducers';

export const selectHealthDashboard = createFeatureSelector<DashboardState>('healthDashboard');
export const selectCaseStatusesByRank = createSelector(
  selectHealthDashboard,
  (state: DashboardState) => state.caseStatusesByRank
);
