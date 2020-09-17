import { createSelector } from '@ngrx/store';
import { selectHealthDashboard } from './case-statuses.selector';
import { HealthDashboardState } from '../reducers';
import { FiltersState } from '../reducers/filters.reducer';

export const selectFilters = createSelector(
  selectHealthDashboard,
  (state: HealthDashboardState) => state.filters
);
export const selectDateFilter = createSelector(
  selectFilters,
  (state: FiltersState) => state.timeRange
);
export const selectAudienceFilter = createSelector(
  selectFilters,
  (state: FiltersState) => state.audience
);
