import * as fromCases from '../actions';
import { ICaseStatus } from '../../cases.interface';
import { CaseStatusActionTypes } from '@controlpanel/contact-trace/cases/store/actions/cases-status.actions';

export interface ICaseStatusState {
  data: ICaseStatus[];
  selectedStatus: ICaseStatus;
  error: boolean;
  loading: boolean;
  loaded: boolean;
}

export const initialState: ICaseStatusState = {
  data: [],
  selectedStatus: null,
  error: false,
  loading: false,
  loaded: false
};

export function reducer(state = initialState, action: fromCases.CasesAction | fromCases.CasesStatusActions ) {
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

    case CaseStatusActionTypes.GET_CASE_STATUS_BY_ID: {
      return {
        ...state,
        error: false,
        loading: true,
        loaded: false
      };
    }

    case CaseStatusActionTypes.GET_CASE_STATUS_BY_ID_SUCCESS: {
      return {
        ...state,
        selectedStatus: action.payload,
        error: false,
        loaded: true,
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
export const getSelectedCaseStatus = (state: ICaseStatusState) => state.selectedStatus;
