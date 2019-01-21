import { ActionReducerMap } from '@ngrx/store';

import * as fromDining from './dining.reducer';

export interface IDiningState {
  dining: fromDining.IDiningState;
}

export const reducers: ActionReducerMap<IDiningState> = {
  dining: fromDining.reducer
};
