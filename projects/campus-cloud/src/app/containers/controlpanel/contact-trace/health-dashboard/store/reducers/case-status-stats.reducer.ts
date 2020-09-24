import { ICaseStatusStat } from '@controlpanel/contact-trace/cases/cases.interface';
import * as fromActions from '@controlpanel/contact-trace/health-dashboard/store/actions';
import { Action, createReducer, on } from '@ngrx/store';
import * as moment from 'moment';

export interface CaseStatusStatsState {
  data: Record<string, Record<number, number>>;
  error: string | null;
  loading: boolean;
}

const initialState: CaseStatusStatsState = {
  data: {},
  error: null,
  loading: false
};

const reducer = createReducer(
  initialState,
  on(fromActions.getCaseStatusStats, (state) => {
    return {
      ...state,
      loading: true
    };
  }),
  on(fromActions.getCaseStatusStatsSuccess, (state, { data }) => {
    return {
      ...state,
      data: getCaseStatusStats(data),
      loading: false,
      error: null
    };
  }),
  on(fromActions.getCaseStatusStatsFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error
    };
  })
);

const getCaseStatusStats = (data: ICaseStatusStat[]) => {
  const result = {};
  data.forEach((stat) => {
    const date = moment.unix(stat.day_start_epoch).format('YYYY-MM-DD');
    if (!result[date]) {
      result[date] = { [stat.case_status_id]: 1 };
    } else if (!result[date][stat.case_status_id]) {
      result[date][stat.case_status_id] = 1;
    } else {
      result[date][stat.case_status_id]++;
    }
  });
  return result;
};

export function caseStatusStatsReducer(state: CaseStatusStatsState | undefined, action: Action) {
  return reducer(state, action);
}
