import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import * as fromCaseStatus from '../reducers/status.reducer';

export const getCaseStatusState = (state: fromFeature.State) => {
  return state.casesModule.caseStatus;
};

export const getCaseStatus = createSelector(
  getCaseStatusState,
  fromCaseStatus.getCaseStatus
);

export const getCaseStatusError = createSelector(
  getCaseStatusState,
  fromCaseStatus.getCaseStatusError
);

export const getCaseStatusLoading = createSelector(
  getCaseStatusState,
  fromCaseStatus.getCaseStatusLoading
);

export const getCaseStatusLoaded = createSelector(
  getCaseStatusState,
  fromCaseStatus.getCaseStatusLoading
);

export const getSelectedCaseStatus = createSelector(
  getCaseStatusState,
  fromCaseStatus.getSelectedCaseStatus
);
