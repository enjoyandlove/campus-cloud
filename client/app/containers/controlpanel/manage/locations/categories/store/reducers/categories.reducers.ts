import { ICategory } from '../../model';
import { IItem } from '@shared/components';
import * as fromLocations from '../actions';

export interface ICategoriesState {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  data: ICategory[];
  errorMessage: string;
  categoryTypes: IItem[];
  filteredCategories: ICategory[];
}

export const initialState: ICategoriesState = {
  data: [],
  error: false,
  loaded: false,
  loading: false,
  errorMessage: null,
  categoryTypes: [],
  filteredCategories: []
};

export function reducer(state = initialState, action: fromLocations.Actions) {
  switch (action.type) {
    case fromLocations.CategoriesActions.GET_CATEGORIES: {
      return {
        ...state,
        error: false,
        loading: true,
        loaded: false
      };
    }

    case fromLocations.CategoriesActions.GET_CATEGORIES_SUCCESS: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        data: [...action.payload]
      };
    }

    case fromLocations.CategoriesActions.GET_CATEGORIES_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
        loading: false
      };
    }

    case fromLocations.CategoriesActions.GET_FILTERED_CATEGORIES: {
      return {
        ...state,
        error: false,
        loading: true,
        loaded: false
      };
    }

    case fromLocations.CategoriesActions.GET_FILTERED_CATEGORIES_SUCCESS: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        filteredCategories: [...action.payload]
      };
    }

    case fromLocations.CategoriesActions.GET_FILTERED_CATEGORIES_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
        loading: false
      };
    }

    case fromLocations.CategoriesActions.POST_CATEGORY: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }

    case fromLocations.CategoriesActions.POST_CATEGORY_SUCCESS: {
      const newCategory = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        data: [...state.data, newCategory],
        filteredCategories: [...state.filteredCategories, newCategory]
      };
    }

    case fromLocations.CategoriesActions.POST_CATEGORY_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromLocations.CategoriesActions.GET_CATEGORIES_TYPE_SUCCESS: {
      return {
        ...state,
        categoryTypes: [...action.payload]
      };
    }

    case fromLocations.CategoriesActions.EDIT_CATEGORY: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }

    case fromLocations.CategoriesActions.EDIT_CATEGORY_FAIL: {
      return {
        ...state,
        error: true,
        loading: false
      };
    }

    case fromLocations.CategoriesActions.EDIT_CATEGORY_SUCCESS: {
      const edited = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        data: state.data.map((c: ICategory) => (c.id === edited.id ? edited : c)),
        filteredCategories: state.filteredCategories.map(
          (c: ICategory) => (c.id === edited.id ? edited : c)
        )
      };
    }

    case fromLocations.CategoriesActions.DELETE_CATEGORIES: {
      return {
        ...state,
        error: false,
        loading: true
      };
    }

    case fromLocations.CategoriesActions.DELETE_CATEGORIES_SUCCESS: {
      const { deletedId } = action.payload;

      return {
        ...state,
        error: false,
        loading: false,
        data: state.data.filter((c: ICategory) => c.id !== deletedId),
        filteredCategories: state.filteredCategories.filter((c: ICategory) => c.id !== deletedId)
      };
    }

    case fromLocations.CategoriesActions.DELETE_CATEGORIES_FAIL: {
      return {
        ...state,
        error: true,
        loading: false,
        errorMessage: action.payload
      };
    }

    case fromLocations.CategoriesActions.RESET_ERROR_MESSAGE: {
      return {
        ...state,
        error: false,
        errorMessage: null
      };
    }

    case fromLocations.CategoriesActions.DESTROY: {
      return {
        ...state,
        ...initialState
      };
    }

    default: {
      return state;
    }
  }
}

export const getCategories = (state: ICategoriesState) => state.data;
export const getCategoriesError = (state: ICategoriesState) => state.error;
export const getCategoriesLoaded = (state: ICategoriesState) => state.loaded;
export const getCategoriesLoading = (state: ICategoriesState) => state.loading;
export const getCategoriesType = (state: ICategoriesState) => state.categoryTypes;
export const getCategoriesErrorMessage = (state: ICategoriesState) => state.errorMessage;
export const getFilteredCategories = (state: ICategoriesState) => state.filteredCategories;
