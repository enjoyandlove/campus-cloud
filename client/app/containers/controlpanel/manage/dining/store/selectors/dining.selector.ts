import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selector';

import * as fromDining from '../reducers/dining.reducer';

export const getDiningState = createSelector(
  getFeatureState,
  (state: fromFeature.IDiningState) => state.dining
);

export const getDiningData = createSelector(
  getDiningState,
  fromDining.getDining
);

export const getDining = createSelector(
  getDiningData,
  (data) => {
    return Object.keys(data).map((id) => data[id]['data']);
  }
);

export const getDiningError = createSelector(
  getDiningState,
  fromDining.getDiningError
);

export const getDiningLoaded = createSelector(
  getDiningState,
  fromDining.getDiningLoaded
);

export const getDiningLoading = createSelector(
  getDiningState,
  fromDining.getDiningLoading
);
