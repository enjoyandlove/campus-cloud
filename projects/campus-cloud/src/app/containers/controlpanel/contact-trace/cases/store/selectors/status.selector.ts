import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selector';
import * as fromCaseStatus from '../reducers/status.reducer';

export const getCaseStatusState = createSelector(
  getFeatureState,
  (state: fromFeature.ICasesState) => state.caseStatus
);

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
