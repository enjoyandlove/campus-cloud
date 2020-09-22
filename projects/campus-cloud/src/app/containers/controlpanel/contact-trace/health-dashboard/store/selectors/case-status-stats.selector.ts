import { CPDate } from '@campus-cloud/shared/utils/date/date';
import { createSelector } from '@ngrx/store';
import { HealthDashboardState } from '../reducers';
import { CaseStatusStatsState } from '../reducers/case-status-stats.reducer';
import { selectHealthDashboard } from './case-statuses.selector';
import { selectDateFilter } from './filters.selector';


export const selectCaseStatusStats = createSelector(
  selectHealthDashboard,
  (state: HealthDashboardState) => state.caseStatusStats
);

export const selectCaseStatusStatsLoading = createSelector(
  selectCaseStatusStats,
  (state: CaseStatusStatsState) => state.loading
);

export const selectCaseStatusStatsForGraph = createSelector(
  [selectCaseStatusStats, selectDateFilter],
  (stats, dateRange) => {
    const result = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };
    const dates = CPDate.enumerateDaysBetweenDates(dateRange.start * 1000, dateRange.end * 1000);
    dates.forEach(date => {
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const dateKey = date.format('YYYY-MM-DD');
          if (stats.data[dateKey] && stats.data[dateKey][key]) {
            result[key].push(stats.data[dateKey][key]);
          } else {
            result[key].push(0);
          }
        }
      }
    });
    return {ranges: dates, data: result};
  }
);
