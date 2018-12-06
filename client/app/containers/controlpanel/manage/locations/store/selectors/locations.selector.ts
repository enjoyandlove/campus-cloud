import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selector';
import { ILocation } from '../../locations.interface';
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
  (locations, router): ILocation => {
    const locationId = parseInt(router.state.params.locationId, 10);

    return locations.filter((location: ILocation) => location.id === locationId)[0];
  }
);
