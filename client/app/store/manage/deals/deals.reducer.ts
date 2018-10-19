import * as actions from './deals.actions';

export interface IDealsState {
  stores: any[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: IDealsState = {
  stores: [],
  loaded: false,
  loading: false
};

export function reducer(state = initialState, action: actions.DealsAction): IDealsState {
  switch (action.type) {
    case actions.LOAD_STORES: {
      return {
        ...state,
        loading: true
      };
    }
    case actions.LOAD_STORES_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }
    case actions.LOAD_STORES_SUCCESS: {
      const stores = action.payload;

      return {
        ...state,
        stores,
        loaded: true,
        loading: false
      };
    }
  }

  return state;
}
