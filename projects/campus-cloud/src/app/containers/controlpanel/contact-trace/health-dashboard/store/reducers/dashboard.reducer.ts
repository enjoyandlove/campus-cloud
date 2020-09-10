import { ICaseStatus } from '@controlpanel/contact-trace/cases/cases.interface';
import * as fromActions from '@controlpanel/contact-trace/health-dashboard/store/actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface DashboardState {
  caseStatusesByRank: Record<string, ICaseStatus>;
  error: string | null;
  loading: boolean;
}

const dashboardInitialState: DashboardState = {
  caseStatusesByRank: {},
  error: null,
  loading: false
};

export const dashboardReducer = createReducer(
  dashboardInitialState,
  on(fromActions.getCaseStatus, (state) => {
    return {
      ...state,
      loading: true
    };
  }),
  on(fromActions.getCaseStatusSuccess, (state, { data }) => {
    return {
      ...state,
      caseStatusesByRank: data.reduce((statuses, caseStatus) => {
        statuses[caseStatus.rank] = caseStatus;
        return statuses;
      }, {}),
      loading: false,
      error: null
    };
  }),
  on(fromActions.getCaseStatusFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error
    };
  })
);

export function reducer(state: DashboardState | undefined, action: Action) {
  return dashboardReducer(state, action);
}
