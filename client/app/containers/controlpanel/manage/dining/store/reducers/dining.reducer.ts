import { EntityState, EntityAdapter, createEntityAdapter, Dictionary } from '@ngrx/entity';

import * as fromDining from '../actions';

import { ILocation } from '@libs/locations/common/model';

export interface IDiningState extends EntityState<ILocation> {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  ids: Array<number>;
  entities: Dictionary<ILocation>;
}

const defaultDining: IDiningState = {
  ids: [],
  entities: {},
  error: false,
  loaded: false,
  loading: false
};

export const diningAdaptor: EntityAdapter<ILocation> = createEntityAdapter<ILocation>();

export const initialState: IDiningState = diningAdaptor.getInitialState(defaultDining);

export function reducer (state = initialState, action: fromDining.DiningAction) {
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
        error: false,
        loaded: true,
        loading: false
      });
    }

    case fromDining.diningActions.GET_DINING_FAIL: {
      return {
        ...state,
        error: true,
        loaded: true
      };
    }

    default: {
      return state;
    }
  }
}

export const { selectAll } = diningAdaptor.getSelectors();

export const getDining = selectAll;
export const getDiningError = (state: IDiningState) => state.error;
export const getDiningLoaded = (state: IDiningState) => state.loaded;
export const getDiningLoading = (state: IDiningState) => state.loading;
