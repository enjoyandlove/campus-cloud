import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getRouterState } from '@campus-cloud/store';
import { getFeatureState } from './feature.selector';
import * as fromCases from '../reducers/cases.reducer';

export const getCaseState = createSelector(
  getFeatureState,
  (state: fromFeature.ICasesState) => state.cases
);

export const getCases = createSelector(
  getCaseState,
  fromCases.getCases
);

export const getCasesError = createSelector(
  getCaseState,
  fromCases.getCasesError
);

export const getCasesLoading = createSelector(
  getCaseState,
  fromCases.getCasesLoading
);

export const getCasesLoaded = createSelector(
  getCaseState,
  fromCases.getCasesLoaded
);

export const getCasesById = (id: number) =>
  createSelector(
    getCaseState,
    (cases) => cases.entities[id]
  );

export const getFilteredCases = createSelector(
  getCaseState,
  fromCases.getFilteredCases
);

export const getSelectedCase = createSelector(
  getRouterState,
  (routeterState) => getCasesById(+routeterState.params.caseId)
);
