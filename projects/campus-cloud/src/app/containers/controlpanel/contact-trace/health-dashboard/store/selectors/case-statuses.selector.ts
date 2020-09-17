import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HealthDashboardState } from '../reducers';
import { CaseStatusesState } from '../reducers/case-statuses.reducer';

export const selectHealthDashboard = createFeatureSelector<HealthDashboardState>('healthDashboard');

export const selectCaseStatuses = createSelector(
  selectHealthDashboard,
  (state: HealthDashboardState) => state.caseStatuses
);
export const selectCaseStatusesByRank = createSelector(
  selectCaseStatuses,
  (state: CaseStatusesState) => state.caseStatusesByRank
);
export const selectCaseStatusesLoading = createSelector(
  selectHealthDashboard,
  (state: HealthDashboardState) => state.caseStatuses.loading
);
