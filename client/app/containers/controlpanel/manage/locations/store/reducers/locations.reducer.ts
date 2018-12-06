import * as fromLocations from '../actions';

import { ILocation } from '../../locations.interface';

export interface ILocationState {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  data: Array<any>;
  editedRecord: Array<any>;
}

export const InitialState: ILocationState = {
  data: [],
  error: false,
  loaded: false,
  loading: false,
  editedRecord: []
};

export function reducer (state = InitialState, action: fromLocations.LocationsAction) {
  switch (action.type) {
    case fromLocations.locationActions.GET_LOCATIONS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromLocations.locationActions.GET_LOCATIONS_SUCCESS: {
      return  {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: [...action.payload]
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
      return  {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: [...state.data],
        editedRecord: action.payload
      };
    }

    case fromLocations.locationActions.GET_LOCATION_BY_ID_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
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

      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: [newCreatedLocation, ...state.data]
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
        loaded: true,
        loading: false
      };
    }

    case fromLocations.locationActions.EDIT_LOCATION_SUCCESS: {
      const edited = action.payload;

      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: state.data.map((l: ILocation) => (l.id === edited.id ? edited : l))
      };
    }

    case fromLocations.locationActions.EDIT_LOCATION_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true,
        loading: false
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

      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: state.data.filter((l: ILocation) => l.id !== deletedId),
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
export const getLocationsError = (state: ILocationState) => state.error;
export const getLocationsLoading = (state: ILocationState) => state.loading;
export const getLocationsById = (state: ILocationState) => state.editedRecord;
