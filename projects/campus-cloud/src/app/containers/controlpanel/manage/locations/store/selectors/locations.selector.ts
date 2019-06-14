import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getRouterState } from '@campus-cloud/src/app/store';
import { getFeatureState } from './feature.selector';
import * as fromLocations from '../reducers/locations.reducer';

export const getLocationState = createSelector(
  getFeatureState,
  (state: fromFeature.ILocationsState) => state.locations
);

export const getLocations = createSelector(
  getLocationState,
  fromLocations.getLocations
);

export const getLocationsError = createSelector(
  getLocationState,
  fromLocations.getLocationsError
);

export const getLocationsLoading = createSelector(
  getLocationState,
  fromLocations.getLocationsLoading
);

export const getLocationsLoaded = createSelector(
  getLocationState,
  fromLocations.getLocationsLoaded
);

export const getLocationsById = (id: number) =>
  createSelector(
    getLocationState,
    (locations) => locations.entities[id]
  );

export const getFilteredLocations = createSelector(
  getLocationState,
  fromLocations.getFilteredLocations
);

export const getSelectedLocation = createSelector(
  getRouterState,
  (routeterState) => getLocationsById(+routeterState.params.locationId)
);
