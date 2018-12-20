import * as fromLocations from '../actions';
import { ICategory } from '../../categories.interface';

export interface ICategoriesState {
  loaded: boolean;
  loading: boolean;
  getError: boolean;
  data: ICategory[];
}

export const InitialState: ICategoriesState = {
  data: [],
  loaded: false,
  loading: false,
  getError: false,
};

export function reducer (state = InitialState, action: fromLocations.Actions) {
  switch (action.type) {
    case fromLocations.CategoriesActions.GET_CATEGORIES: {
      return {
        ...state,
        loading: true,
        loaded: false,
        getError: false
      };
    }

    case fromLocations.CategoriesActions.GET_CATEGORIES_SUCCESS: {
      return  {
        ...state,
        data: [...action.payload],
        loaded: true,
        loading: false,
        getError: false
      };
    }

    case fromLocations.CategoriesActions.GET_CATEGORIES_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false,
        getError: true
      };
    }

    default: {
      return state;
    }
  }
}


export const getCategories = (state: ICategoriesState) => state.data;
export const getCategoriesLoaded = (state: ICategoriesState) => state.loaded;
export const getCategoriesError = (state: ICategoriesState) => state.getError;
export const getCategoriesLoading = (state: ICategoriesState) => state.loading;
