import { ActionReducerMap } from '@ngrx/store';
import * as fromCases from './cases.reducer';
import * as fromCaseStatus from './status.reducer';

export interface ICasesState {
  cases: fromCases.ICaseState;
  caseStatus: fromCaseStatus.ICaseStatusState;
}

export interface State {
  caseModule: ICasesState;
}

export const reducers: ActionReducerMap<ICasesState> = {
  cases: fromCases.reducer,
  caseStatus: fromCaseStatus.reducer
};
