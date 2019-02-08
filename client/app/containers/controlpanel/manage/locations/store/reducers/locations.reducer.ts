import { EntityState, createEntityAdapter, EntityAdapter, Dictionary } from '@ngrx/entity';

import * as fromLocations from '../actions';

import { ILocation } from '../../model';

export interface ILocationState extends EntityState<ILocation> {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  ids: Array<number>;
  filteredLocations: ILocation[];
  entities: Dictionary<ILocation>;
}

const defaultLocation: ILocationState = {
  ids: [],
  entities: {},
  error: false,
  loaded: false,
  loading: false,
  filteredLocations: []
};

export const locationAdapter: EntityAdapter<ILocation> = createEntityAdapter<ILocation>();
export const initialState: ILocationState = locationAdapter.getInitialState(defaultLocation);

export function reducer (state = initialState, action: fromLocations.LocationsAction) {
  switch (action.type) {
    case fromLocations.locationActions.GET_LOCATIONS: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case fromLocations.locationActions.GET_LOCATIONS_SUCCESS: {
      return locationAdapter.addAll(action.payload, {
        ...state,
        error: false,
        loaded: true,
        loading: false
      });
    }

    case fromLocations.locationActions.GET_LOCATIONS_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
        loading: false
      };
    }

    case fromLocations.locationActions.GET_FILTERED_LOCATIONS: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case fromLocations.locationActions.GET_FILTERED_LOCATIONS_SUCCESS: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        filteredLocations: [...action.payload]
      };
    }

    case fromLocations.locationActions.GET_FILTERED_LOCATIONS_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
        loading: false
      };
    }

    case fromLocations.locationActions.GET_LOCATION_BY_ID: {
      return {
        ...state,
        loading: true
      };
    }

    case fromLocations.locationActions.GET_LOCATION_BY_ID_SUCCESS: {
      return locationAdapter.upsertOne(action.payload, {
        ...state,
        error: false,
        loading: false
      });
    }

    case fromLocations.locationActions.GET_LOCATION_BY_ID_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromLocations.locationActions.POST_LOCATION: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }

    case fromLocations.locationActions.POST_LOCATION_SUCCESS: {
      return locationAdapter.addOne(action.payload, {
        ...state,
        error: false,
        loading: false
      });
    }

    case fromLocations.locationActions.POST_LOCATION_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromLocations.locationActions.EDIT_LOCATION: {
      return {
        ...state,
        error: false,
        loading: false
      };
    }

    case fromLocations.locationActions.EDIT_LOCATION_SUCCESS: {
      return locationAdapter.updateOne({id: action.payload.data.id, changes: action.payload.data }, {
        ...state,
        error: false,
        loading: false
      });
    }

    case fromLocations.locationActions.EDIT_LOCATION_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false,
      };
    }

    case fromLocations.locationActions.DELETE_LOCATION: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: true
      };
    }

    case fromLocations.locationActions.DELETE_LOCATION_SUCCESS: {
      const deletedId = action.payload.deletedId;
      const data =  locationAdapter.removeOne(deletedId, {
        ...state,
        error: false,
        loaded: true,
        loading: false
      });

      return {
        ...data,
        filteredLocations: state.filteredLocations.filter((l: ILocation) => l.id !== deletedId)
      };
    }

    case fromLocations.locationActions.DELETE_LOCATION_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
      };
    }

    case fromLocations.locationActions.RESET_ERROR: {
      return {
        ...state,
        error: false
      };
    }

    default: {
      return state;
    }
  }
}

export const { selectAll, selectEntities } = locationAdapter.getSelectors();

export const getLocations = selectAll;
export const getLocationEntities = selectEntities;
export const getLocationsError = (state: ILocationState) => state.error;
export const getLocationsLoaded = (state: ILocationState) => state.loaded;
export const getLocationsLoading = (state: ILocationState) => state.loading;
export const getFilteredLocations = (state: ILocationState) => state.filteredLocations;
