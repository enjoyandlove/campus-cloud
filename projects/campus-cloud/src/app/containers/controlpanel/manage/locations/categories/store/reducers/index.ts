import { ActionReducerMap } from '@ngrx/store';

import * as fromCategories from './categories.reducers';

export interface ICategoriesState {
  categories: fromCategories.ICategoriesState;
}

export const reducers: ActionReducerMap<ICategoriesState> = {
  categories: fromCategories.reducer
};
