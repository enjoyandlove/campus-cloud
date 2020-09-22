import { ICaseStatus } from '@controlpanel/contact-trace/cases/cases.interface';
import * as fromActions from '@controlpanel/contact-trace/health-dashboard/store/actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface CaseStatusesState {
  caseStatusesByRank: Record<string, ICaseStatus>;
  data: ICaseStatus[];
  error: string | null;
  loading: boolean;
}

const initialState: CaseStatusesState = {
  caseStatusesByRank: {},
  data: [],
  error: null,
  loading: false
};

const reducer = createReducer(
  initialState,
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
      data,
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

export function caseStatusesReducer(state: CaseStatusesState | undefined, action: Action) {
  return reducer(state, action);
}
