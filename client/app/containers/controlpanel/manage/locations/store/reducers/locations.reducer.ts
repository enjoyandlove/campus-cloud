import * as fromLocations from '../actions';

import { ILocation } from '../../model';

export interface ILocationState {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  data: {
    [id: number]: {
      has_schedule: boolean,
      data: ILocation
    }
  };
}

export const InitialState: ILocationState = {
  data: {},
  error: false,
  loaded: false,
  loading: false
};

export function reducer (state = InitialState, action: fromLocations.LocationsAction) {
  switch (action.type) {
    case fromLocations.locationActions.GET_LOCATIONS: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case fromLocations.locationActions.GET_LOCATIONS_SUCCESS: {
      const data = action.payload.reduce(
        ( entities: { [id: number]: ILocation }, location: ILocation) => {
          return {
            ...entities,
            [location.id]: {
              has_schedule: false,
              data: location
            }
          };
        },
        {
          ...{}
        });

      return  {
        ...state,
        data,
        error: false,
        loaded: true,
        loading: false
      };
    }

    case fromLocations.locationActions.GET_LOCATIONS_FAIL: {
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
      const payload = action.payload;

      const data = {
        ...state.data,
        [payload.id]: {
          data: payload,
          has_schedule: true
        }
      };

      return  {
        ...state,
        data,
        error: false,
        loading: false
      };
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
        loaded: true,
        loading: true
      };
    }

    case fromLocations.locationActions.POST_LOCATION_SUCCESS: {
      const newCreatedLocation = action.payload;

      const data = {
        [newCreatedLocation.id]: {
          data: newCreatedLocation,
          has_schedule: true
        },
        ...state.data,
      };

      return {
        ...state,
        data,
        error: false,
        loaded: true,
        loading: false
      };
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
      const edited = action.payload;

      const data = {
        ...state.data,
        [edited.id]: {
          data: edited,
          has_schedule: true
        }
      };

      return {
        ...state,
        data,
        error: false,
        loading: false
      };
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
      const { deletedId } = action.payload;

      const data = {
        ...state.data,
      };

      delete data[deletedId];

      return {
        ...state,
        data,
        error: false,
        loaded: true,
        loading: false
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


export const getLocations = (state: ILocationState) => state.data;
export const getLocationsError = (state: ILocationState) => state.error;
export const getLocationsLoaded = (state: ILocationState) => state.loaded;
export const getLocationsLoading = (state: ILocationState) => state.loading;
