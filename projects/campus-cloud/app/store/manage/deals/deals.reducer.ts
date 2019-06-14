import * as actions from './deals.actions';
import { IDealsState } from './deals.state';
import { IItem, getItem } from '@campus-cloud/app/shared/components';

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

    case actions.CREATE_STORE:
    case actions.CREATE_STORE_FAIL:
    case actions.EDIT_STORE:
    case actions.EDIT_STORE_FAIL:
    case actions.DELETE_STORE:
    case actions.DELETE_STORE_FAIL:
      return state;

    case actions.CREATE_STORE_SUCCESS: {
      const stores = [getItem(action.payload, 'name', 'id'), ...state.stores];
      return { ...state, stores };
    }

    case actions.EDIT_STORE_SUCCESS: {
      return {
        ...state,
        stores: state.stores.map((store: IItem) => {
          if (store.action === action.payload.id) {
            return getItem(action.payload, 'name', 'id');
          }
          return store;
        })
      };
    }

    case actions.DELETE_STORE_SUCCESS: {
      return {
        ...state,
        stores: state.stores.filter((store: IItem) => store.action !== action.payload)
      };
    }
  }

  return state;
}
