import { caseStatusesReducer, CaseStatusesState } from './case-statuses.reducer';
import { filtersReducer, FiltersState } from './filters.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface HealthDashboardState {
  caseStatuses: CaseStatusesState;
  filters: FiltersState;
}

export const reducers: ActionReducerMap<HealthDashboardState> = {
  caseStatuses: caseStatusesReducer,
  filters: filtersReducer
};
