import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selector';
import { getRouterState } from '@app/store/base/router-state';
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

export const getLocationsById = createSelector(
  getLocationState,
  fromLocations.getLocationEntities
);

export const getSelectedLocation = createSelector(
  getLocationsById,
  getRouterState,
  (locations, router) => {
    const locationId = parseInt(router.state.params.locationId, 10);

    if (locations[locationId]) {
      return locations[locationId];
    }
  }
);
