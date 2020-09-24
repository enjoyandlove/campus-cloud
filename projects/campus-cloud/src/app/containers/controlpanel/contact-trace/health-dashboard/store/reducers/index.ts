import { caseStatusesReducer, CaseStatusesState } from './case-statuses.reducer';
import { filtersReducer, FiltersState } from './filters.reducer';
import { caseStatusStatsReducer, CaseStatusStatsState } from './case-status-stats.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface HealthDashboardState {
  caseStatuses: CaseStatusesState;
  filters: FiltersState;
  caseStatusStats: CaseStatusStatsState;
}

export const reducers: ActionReducerMap<HealthDashboardState> = {
  caseStatuses: caseStatusesReducer,
  filters: filtersReducer,
  caseStatusStats: caseStatusStatsReducer
};
