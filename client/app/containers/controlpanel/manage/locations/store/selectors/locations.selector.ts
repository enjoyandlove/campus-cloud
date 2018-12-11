import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { LocationModel } from '../../model';
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

export const getSelectedLocation = createSelector(
  getLocations,
  fromFeature.getRouterState,
  (locations, router): LocationModel => {
    const locationId = parseInt(router.state.params.locationId, 10);

    return locations.filter((location: LocationModel) => location.id === locationId)[0];
  }
);
