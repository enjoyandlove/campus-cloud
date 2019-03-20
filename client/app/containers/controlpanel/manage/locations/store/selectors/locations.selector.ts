import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getRouterState } from '@client/app/store';
import { getFeatureState } from './feature.selector';
import * as fromLocations from '../reducers/locations.reducer';

export const getLocationState = createSelector(
  getFeatureState,
  (state: fromFeature.ILocationsState) => state.locations
);

export const getLocations = createSelector(getLocationState, fromLocations.getLocations);

export const getLocationsError = createSelector(getLocationState, fromLocations.getLocationsError);

export const getLocationsLoading = createSelector(
  getLocationState,
  fromLocations.getLocationsLoading
);

export const getLocationsLoaded = createSelector(
  getLocationState,
  fromLocations.getLocationsLoaded
);

export const getLocationsById = createSelector(getLocationState, fromLocations.getLocationEntities);

export const getFilteredLocations = createSelector(
  getLocationState,
  fromLocations.getFilteredLocations
);

export const getSelectedLocation = createSelector(
  getLocationsById,
  getRouterState,
  (locations, router) => {
    const locationId = parseInt(router.params.locationId, 10);

    if (locations[locationId]) {
      return locations[locationId];
    }
  }
);
