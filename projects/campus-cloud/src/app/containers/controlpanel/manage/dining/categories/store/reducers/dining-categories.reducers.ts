import { createEntityAdapter, Dictionary, EntityAdapter, EntityState } from '@ngrx/entity';

import * as fromCategories from '../actions';
import {
  ICategory,
  ICategoriesApiQuery
} from '@campus-cloud/libs/locations/common/categories/model';

export interface ICategoriesState extends EntityState<ICategory> {
  error: boolean;
  loaded: boolean;
  loading: boolean;
  ids: Array<number>;
  entities: Dictionary<ICategory>;
  filteredCategories: ICategory[];
  categoriesParamState: ICategoriesApiQuery;
}

const defaultCategory: ICategoriesState = {
  ids: [],
  entities: {},
  error: false,
  loaded: false,
  loading: false,
  filteredCategories: [],
  categoriesParamState: {
    search_str: null,
    sort_field: 'name',
    sort_direction: 'asc'
  }
};

export const categoryAdaptor: EntityAdapter<ICategory> = createEntityAdapter<ICategory>();

export const initialState: ICategoriesState = categoryAdaptor.getInitialState(defaultCategory);

export function reducer(state = initialState, action: fromCategories.Actions) {
  switch (action.type) {
    case fromCategories.CategoriesActions.POST_CATEGORY:
    case fromCategories.CategoriesActions.EDIT_CATEGORY:
    case fromCategories.CategoriesActions.GET_CATEGORIES:
    case fromCategories.CategoriesActions.DELETE_CATEGORIES:
    case fromCategories.CategoriesActions.GET_FILTERED_CATEGORIES: {
      return {
        ...state,
        error: false,
        loading: true,
        loaded: false
      };
    }

    case fromCategories.CategoriesActions.POST_CATEGORY_FAIL:
    case fromCategories.CategoriesActions.EDIT_CATEGORY_FAIL:
    case fromCategories.CategoriesActions.GET_CATEGORIES_FAIL:
    case fromCategories.CategoriesActions.DELETE_CATEGORIES_FAIL:
    case fromCategories.CategoriesActions.GET_FILTERED_CATEGORIES_FAIL: {
      return {
        ...state,
        error: true,
        loaded: false,
        loading: false
      };
    }

    case fromCategories.CategoriesActions.GET_CATEGORIES_SUCCESS: {
      return categoryAdaptor.addAll(action.payload, {
        ...state,
        error: false,
        loaded: true,
        loading: false
      });
    }

    case fromCategories.CategoriesActions.GET_FILTERED_CATEGORIES_SUCCESS: {
      return {
        ...state,
        error: false,
        loaded: true,
        loading: false,
        filteredCategories: [...action.payload]
      };
    }

    case fromCategories.CategoriesActions.POST_CATEGORY_SUCCESS: {
      const result = categoryAdaptor.addOne(action.payload, {
        ...state,
        error: false,
        loaded: true,
        loading: false
      });

      return {
        ...result,
        filteredCategories: [...state.filteredCategories, action.payload]
      };
    }

    case fromCategories.CategoriesActions.EDIT_CATEGORY_SUCCESS: {
      const edited = action.payload;

      const result = categoryAdaptor.updateOne(
        { id: action.payload.id, changes: action.payload },
        {
          ...state,
          error: false,
          loaded: true,
          loading: false
        }
      );

      return {
        ...result,
        filteredCategories: state.filteredCategories.map((c: ICategory) =>
          c.id === edited.id ? edited : c
        )
      };
    }

    case fromCategories.CategoriesActions.DELETE_CATEGORIES_SUCCESS: {
      const { deletedId } = action.payload;

      const result = categoryAdaptor.removeOne(deletedId, {
        ...state,
        error: false,
        loaded: true,
        loading: false
      });

      return {
        ...result,
        filteredCategories: state.filteredCategories.filter((c: ICategory) => c.id !== deletedId)
      };
    }

    case fromCategories.CategoriesActions.SET_CATEGORIES_API_QUERY: {
      return {
        ...state,
        categoriesParamState: action.payload
      };
    }

    case fromCategories.CategoriesActions.DESTROY: {
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

export const { selectAll } = categoryAdaptor.getSelectors();

export const getCategories = selectAll;
export const getCategoriesError = (state: ICategoriesState) => state.error;
export const getCategoriesLoaded = (state: ICategoriesState) => state.loaded;
export const getCategoriesLoading = (state: ICategoriesState) => state.loading;
export const getFilteredCategories = (state: ICategoriesState) => state.filteredCategories;
export const getCategoriesParamState = (state: ICategoriesState) => state.categoriesParamState;
