import { createSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';
import { getFeatureState } from './feature.selectors';
import * as fromCategories from '../reducers/dining-categories.reducers';

export const getCategoriesState = createSelector(
  getFeatureState,
  (state: fromFeature.ICategoriesState) => state.diningCategories
);

export const getCategories = createSelector(
  getCategoriesState,
  fromCategories.getCategories
);

export const getCategoriesType = createSelector(
  getCategoriesState,
  fromCategories.getCategoriesType
);

export const getFilteredCategories = createSelector(
  getCategoriesState,
  fromCategories.getFilteredCategories
);

export const getCategoriesParamState = createSelector(
  getCategoriesState,
  fromCategories.getCategoriesParamState
);

export const getCategoriesError = createSelector(
  getCategoriesState,
  fromCategories.getCategoriesError
);

export const getCategoriesLoading = createSelector(
  getCategoriesState,
  fromCategories.getCategoriesLoading
);

export const getCategoriesLoaded = createSelector(
  getCategoriesState,
  fromCategories.getCategoriesLoaded
);
