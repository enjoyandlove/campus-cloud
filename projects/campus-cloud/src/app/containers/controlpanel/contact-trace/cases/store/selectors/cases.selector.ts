import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCases from '../reducers/cases.reducer';

export const getCaseState = (state: fromFeature.State) => {
  return state.casesModule.cases;
};

export const getCases = createSelector(
  getCaseState,
  fromCases.getCases
);

export const getCasesError = createSelector(
  getCaseState,
  fromCases.getCasesError
);

export const getCasesErrorMessage = createSelector(
  getCaseState,
  fromCases.getCasesErrorMessage
);

export const getCasesLoading = createSelector(
  getCaseState,
  fromCases.getCasesLoading
);

export const getCasesLoaded = createSelector(
  getCaseState,
  fromCases.getCasesLoaded
);

export const getCasesById = createSelector(
  getCaseState,
  (cases) => cases.entities[cases.selectedCaseId]
);

export const getFilteredCases = createSelector(
  getCaseState,
  fromCases.getFilteredCases
);
