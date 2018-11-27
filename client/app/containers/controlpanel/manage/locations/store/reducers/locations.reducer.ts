import * as fromLocations from '../actions';

import { ILocation } from '../../locations.interface';

export interface ILocationState {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  data: ILocation[];
}

export const InitialState: ILocationState = {
  data: [],
  error: false,
  loaded: false,
  loading: false
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
        loading: false,
        data: action.payload
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

    default: {
      return state;
    }
  }
}


export const getLocations = (state: ILocationState) => state.data;
export const getLocationsLoading = (state: ILocationState) => state.loading;
