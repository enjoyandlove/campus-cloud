import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { LocationModel } from '../../model';
import { getFeatureState } from './feature.selector';
import * as fromLocations from '../reducers/locations.reducer';

export const getLocationState = createSelector(
  getFeatureState,
  (state: fromFeature.ILocationsState) => state.locations
);

export const getLocationsData = createSelector(
  getLocationState,
  fromLocations.getLocations
);

export const getLocations = createSelector(
  getLocationsData,
  (data) => {
    return Object.keys(data).map((id) => data[id]);
  }
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
  fromLocations.getLocations
);

export const getLocationLoadedAll = createSelector(
  getLocationState,
  fromLocations.getLocationLoadedAll
);

export const getSelectedLocation = createSelector(
  getLocationsData,
  fromFeature.getRouterState,
  (locations, router): LocationModel => {
    const locationId = parseInt(router.state.params.locationId, 10);

    return locations[locationId];
  }
);
