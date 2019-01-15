import * as fromDining from '../actions';

import { ILocation } from '../../../locations/model';

export interface IDiningState {
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

export const InitialState: IDiningState = {
  data: {},
  error: false,
  loaded: false,
  loading: false
};

export function reducer (state = InitialState, action: fromDining.DiningAction) {
  switch (action.type) {
    case fromDining.diningActions.GET_DINING: {
      return {
        ...state,
        loading: true,
        loaded: false
      };
    }

    case fromDining.diningActions.GET_DINING_SUCCESS: {
      const data = action.payload.reduce(
        ( entities: { [id: number]: ILocation }, dining: ILocation) => {
          return {
            ...entities,
            [dining.id]: {
              has_schedule: false,
              data: dining
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

    case fromDining.diningActions.GET_DINING_FAIL: {
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


export const getDining = (state: IDiningState) => state.data;
export const getDiningError = (state: IDiningState) => state.error;
export const getDiningLoaded = (state: IDiningState) => state.loaded;
export const getDiningLoading = (state: IDiningState) => state.loading;
