import { ActionReducerMap } from '@ngrx/store';

import * as fromDining from './dining.reducer';

export interface IDiningState {
  dining: fromDining.State;
}

export const reducers: ActionReducerMap<IDiningState> = {
  dining: fromDining.reducer
};
