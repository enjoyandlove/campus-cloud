import { ActionReducerMap } from '@ngrx/store';

import * as fromCategories from './dining-categories.reducers';

export interface ICategoriesState {
  diningCategories: fromCategories.ICategoriesState;
}

export const reducers: ActionReducerMap<ICategoriesState> = {
  diningCategories: fromCategories.reducer
};
