import * as fromLocations from '../actions';

import { ILocation } from '../../model';

export interface ILocationState {
  loaded: boolean;
  loading: boolean;
  editError: boolean;
  loadedAll: boolean;
  getError: boolean;
  postError: boolean;
  data: {
    [id: number]: {
      has_schedule: boolean,
      data: ILocation
    }
  };
}

export const InitialState: ILocationState = {
  data: {},
  loaded: false,
  loading: false,
  getError: false,
  editError: false,
  loadedAll: false,
  postError: false
};

export function reducer (state = InitialState, action: fromLocations.LocationsAction) {
  switch (action.type) {
    case fromLocations.locationActions.GET_LOCATIONS: {
      return {
        ...state,
        loading: true,
        loaded: false,
        loadedAll: false
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
        loaded: true,
        loading: false,
        getError: false,
        loadedAll: true,
        postError: false,
        editError: false
      };
    }

    case fromLocations.locationActions.GET_LOCATIONS_FAIL: {
      return {
        ...state,
        loaded: false,
        getError: true,
        loading: false,
        loadedAll: false
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
        loaded: true,
        loading: false,
        getError: false,
        postError: false,
        editError: false
      };
    }

    case fromLocations.locationActions.GET_LOCATION_BY_ID_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false,
        getError: true
      };
    }

    case fromLocations.locationActions.POST_LOCATION: {
      return {
        ...state,
        loaded: true,
        loading: true,
        getError: false,
        postError: false,
        editError: false
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
        loaded: true,
        loading: false,
        postError: false
      };
    }

    case fromLocations.locationActions.POST_LOCATION_FAIL: {
      return {
        ...state,
        loaded: true,
        loading: false,
        postError: true
      };
    }

    case fromLocations.locationActions.EDIT_LOCATION: {
      return {
        ...state,
        loaded: true,
        loading: false,
        getError: false,
        postError: false,
        editError: false
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
        loaded: true,
        loading: false,
        editError: false
      };
    }

    case fromLocations.locationActions.EDIT_LOCATION_FAIL: {
      return {
        ...state,
        loaded: true,
        loading: false,
        editError: true,
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

    default: {
      return state;
    }
  }
}


export const getLocations = (state: ILocationState) => state.data;
export const getLocationsLoaded = (state: ILocationState) => state.loaded;
export const getLocationsError = (state: ILocationState) => state.getError;
export const getLocationsLoading = (state: ILocationState) => state.loading;
export const getLocationLoadedAll = (state: ILocationState) => state.loadedAll;
export const getLocationsPostError = (state: ILocationState) => state.postError;
export const getLocationsEditError = (state: ILocationState) => state.editError;
