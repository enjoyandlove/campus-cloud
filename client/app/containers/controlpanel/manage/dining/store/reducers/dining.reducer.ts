import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as fromDining from '../actions';

// import { ILocation } from '@libs/locations/common/model';

/*export interface IDiningState {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  data: ILocation;
}*/

export interface State extends EntityState<any> {}

export const diningAdaptor: EntityAdapter<any> = createEntityAdapter<any>();

export const InitialState = diningAdaptor.getInitialState();

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
      return diningAdaptor.addAll(action.payload, {
        ...state,
        error: true,
        loaded: true,
        loading: false
      });
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

export const { selectAll } = diningAdaptor.getSelectors();

export const getDining = selectAll;
export const getDiningError = (state: any) => state.error;
export const getDiningLoaded = (state: any) => state.loaded;
export const getDiningLoading = (state: any) => state.loading;
