import * as fromCases from '../actions';
import { ICaseStatus } from '../../cases.interface';

export interface ICaseStatusState {
  data: ICaseStatus[];
  error: boolean;
  loading: boolean;
  loaded: boolean;
}

export const initialState: ICaseStatusState = {
  data: [],
  error: false,
  loading: false,
  loaded: false
};

export function reducer(state = initialState, action: fromCases.CasesAction) {
  switch (action.type) {
    case fromCases.caseActions.GET_CASE_STATUS: {
      return {
        ...state,
        error: false,
        loading: true,
        loaded: false
      };
    }

    case fromCases.caseActions.GET_CASE_STATUS_SUCCESS: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: [...action.payload]
      };
    }

    case fromCases.caseActions.GET_CASE_STATUS_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
        loading: false
      };
    }

    default: {
      return state;
    }
  }
}

export const getCaseStatus = (state: ICaseStatusState) => state.data;
export const getCaseStatusError = (state: ICaseStatusState) => state.error;
export const getCaseStatusLoading = (state: ICaseStatusState) => state.loading;
export const getCaseStatusLoaded = (state: ICaseStatusState) => state.loaded;
