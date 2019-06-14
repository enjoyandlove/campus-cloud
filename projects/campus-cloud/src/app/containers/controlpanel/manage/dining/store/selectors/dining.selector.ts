import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selector';

import { getRouterState } from '@campus-cloud/src/app/store';
import * as fromDining from '../reducers/dining.reducer';

export const getDiningState = createSelector(
  getFeatureState,
  (state: fromFeature.IDiningState) => state.dining
);

export const getDining = createSelector(
  getDiningState,
  fromDining.getDining
);

export const getFilteredDining = createSelector(
  getDiningState,
  fromDining.getFilteredDining
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

export const getDiningEntities = createSelector(
  getDiningState,
  fromDining.getDiningEntities
);

export const getSelectedDining = createSelector(
  getDiningEntities,
  getRouterState,
  (dining, router) => {
    const diningId = parseInt(router.params.diningId, 10);

    if (dining[diningId]) {
      return dining[diningId];
    }
  }
);
